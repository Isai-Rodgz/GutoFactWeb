import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { ShiftService } from 'src/app/services/shift.service';
import { CurrentShiftService } from 'src/app/services/current-shift.service';

import { Shift } from 'src/app/models/shift.model';
import { Product } from 'src/app/models/product.model';
import { Ticket } from 'src/app/models/ticket.model';
import { TicketItem } from 'src/app/models/ticket-item.model';
import { Category } from 'src/app/models/category.model';

import { ProductService } from 'src/app/services/product.service';
import { TicketService } from 'src/app/services/ticket.service';
import { TicketItemService } from 'src/app/services/ticket-item.service';
import { TicketManagementService } from 'src/app/services/ticket-management.service';
import { CategoryService } from 'src/app/services/category.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-work-desk',
  templateUrl: './work-desk.page.html',
  styleUrls: ['./work-desk.page.scss'],
  standalone: false,
})
export class WorkDeskPage implements OnInit {

  currentShift: Shift | null = null;

  showOpenShiftModal = false;

  initialCash: number | null = null;

  shiftError = '';

  products: Product[] = [];

  categories: Category[] = [];

  filteredProducts: Product[] = [];

  selectedCategoryId: string | null = null;

  searchTerm = '';

  showSearch = false;

  openTickets: Ticket[] = [];

  currentTicket: Ticket | null = null;

  ticketItems: TicketItem[] = [];

  ticketTotal = 0;

  ticketError = '';

  showTicketActionModal = false;

  ticketAction: 'cancel' | 'delete' | null = null;

  ticketActionReason = '';

  showCheckoutModal = false;

  paymentMethod: 'cash' | 'card' | 'transfer' = 'cash';

  paymentReference = '';

  checkoutError = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    public session: SessionService,
    private shiftService: ShiftService,
    private currentShiftService: CurrentShiftService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ticketService: TicketService,
    private ticketItemService: TicketItemService,
    private checkoutService: CheckoutService,
    private menuController: MenuController,
    private ticketManagementService: TicketManagementService,
  ) {}

  // Cerrar sesión
  logout() {

    this.auth.logout();

    this.router.navigate(['/mainpage']);
  }

  // Cargar productos activos
    private loadProducts(): void {

    this.products =
      this.productService.getActive();

    console.log(
      'Productos activos:',
      this.products
    );
  }

  ngOnInit() {

    const user = this.session.user();

    if (!user) {

      console.log(
        'No hay usuario en sesión'
      );

      return;
    }

    this.currentShift =
      this.currentShiftService.getCurrentShift();

    if (!this.currentShift) {

      console.log(
        'No hay ningún turno abierto'
      );

      return;
    }


    // Cargar productos y categorías
    this.loadCatalog();

    // Carga los tickets abiertos
    this.loadOpenTickets();

    console.log(
      'Turno actual:',
      this.currentShift
    );


  }


  // Se ejecuta cada vez que la página se vuelve a mostrar para cargar nuevas actualizaciones de contenido
  ionViewWillEnter(): void {

    const user = this.session.user();

    if (!user) {
      return;
    }

    this.currentShift =
      this.currentShiftService.getCurrentShift();

    this.loadCatalog();
    this.loadOpenTickets();

  }


    // Mostrar modal para abrir turno
    openShiftModal() {

      this.initialCash = null;

      this.shiftError = '';

      this.showOpenShiftModal = true;
    }

    // Cerrar modal
    closeOpenShiftModal() {

      this.showOpenShiftModal = false;

      this.initialCash = null;

      this.shiftError = '';
    }

  // Abrir turno
  async openShift() {

    const user = this.session.user();

    if (!user) {

      this.shiftError =
        'No hay un usuario en sesión.';

      return;
    }

    if (
      this.initialCash === null ||
      this.initialCash < 0
    ) {

      this.shiftError =
        'El efectivo inicial no puede ser negativo.';

      return;
    }

    try {

      const shift =
        await this.shiftService.openShift(
          user.id,
          this.initialCash
        );

      this.currentShift = shift;

      this.showOpenShiftModal = false;

      this.initialCash = null;

      this.shiftError = '';

      console.log(
        'Turno abierto:',
        shift
      );

    } catch (error) {

      console.error(
        'Error al abrir el turno:',
        error
      );

      this.shiftError =
        error instanceof Error
          ? error.message
          : 'No se pudo abrir el turno.';
    }
  }


  // Cargar catálogo de productos y categorías
  private loadCatalog(): void {

    this.categories =
      this.categoryService.getActive();

    this.products =
      this.productService.getActive();

    this.filteredProducts = [];

    this.selectedCategoryId = null;

    this.searchTerm = '';
  }


  // Aplicar filtros de categoría y búsqueda
  selectCategory(categoryId: string | null): void {

    this.selectedCategoryId = categoryId;

    this.applyProductFilters();
  }


  // Obtener el nombre de la categoría seleccionada
  getSelectedCategoryName(): string {

    if (!this.selectedCategoryId) {
      return 'Todos los artículos';
    }

    const category =
      this.categories.find(
        category =>
          category.id === this.selectedCategoryId
      );

    return category?.name ?? 'Todos los artículos';
  }


  // Aplicar filtros de búsqueda
  private applyProductFilters(): void {

    let result = [...this.products];

    if (this.selectedCategoryId) {

      result = result.filter(
        product =>
          product.categoryId === this.selectedCategoryId
      );
    }

    if (this.searchTerm.trim()) {

      const search =
        this.searchTerm
          .trim()
          .toLowerCase();

      result = result.filter(
        product =>
          product.name
            .toLowerCase()
            .includes(search)
      );
    }

    this.filteredProducts = result;
  }

  // Manejar cambios en el término de búsqueda
  onSearchChange(): void {

    this.applyProductFilters();
  }


  // Agregar producto al ticket
  addProduct(product: Product): void {

    if (!this.currentShift) {

      this.ticketError =
        'No hay un turno abierto.';

      return;
    }

    const user = this.session.user();

    if (!user) {

      this.ticketError =
        'No hay un usuario en sesión.';

      return;
    }

    try {

      // Si todavía no tenemos ticket,
      // creamos uno para este turno.
      if (!this.currentTicket) {

        this.currentTicket =
          this.ticketService.create(
            this.currentShift.id,
            user.id
          );
        
        //cargamos el ticket que acabamos de abrir
        this.loadOpenTickets();
      }

      const item =
        this.ticketItemService.add(
          this.currentTicket.id,
          product.id,
          1
        );

      this.ticketItems =
        this.ticketItemService.getByTicketId(
          this.currentTicket.id
        );

      this.ticketTotal =
        this.ticketItemService.getTicketTotal(
          this.currentTicket.id
        );

      this.ticketError = '';

      console.log(
        'Producto agregado:',
        item
      );

      console.log(
        'Ticket actual:',
        this.currentTicket
      );

      console.log(
        'Items:',
        this.ticketItems
      );

      console.log(
        'Total:',
        this.ticketTotal
      );

    } catch (error) {

      console.error(
        'Error al agregar producto:',
        error
      );

      this.ticketError =
        error instanceof Error
          ? error.message
          : 'No se pudo agregar el producto.';
    }
  }


  // Cargar los tickets abiertos del turno actual
  private loadOpenTickets(): void {

    if (!this.currentShift) {
      this.openTickets = [];
      return;
    }

    this.openTickets = this.ticketService
      .getByShiftId(this.currentShift.id)
      .filter(ticket => ticket.status === 'open')
      .sort((a, b) => a.number - b.number);
  }


  // Crear un nuevo ticket para el turno actual
  createTicket(): void {

    this.ticketError = '';

    if (!this.currentShift) {
      this.ticketError = 'No hay un turno abierto.';
      return;
    }

    const user = this.session.user();

    if (!user) {
      this.ticketError = 'No hay un usuario en sesión.';
      return;
    }

    try {

      const ticket = this.ticketService.create(
        this.currentShift.id,
        user.id
      );

      this.loadOpenTickets();

      this.selectTicket(ticket);

    } catch (error) {

      this.ticketError =
        error instanceof Error
          ? error.message
          : 'No se pudo crear el ticket.';
    }
  }


  // Seleccionar un ticket abierto
  selectTicket(ticket: Ticket): void {

    if (ticket.status !== 'open') {
      this.ticketError = 'El ticket no está abierto.';
      return;
    }

    this.currentTicket = ticket;

    this.ticketItems =
      this.ticketItemService.getByTicketId(
        ticket.id
      );

    this.ticketTotal =
      this.ticketItemService.getTicketTotal(
        ticket.id
      );

    this.ticketError = '';
  }


  cancelCurrentTicket(reason?: string): void {
    this.ticketError = '';

    if (!this.currentTicket) {
      this.ticketError = 'No hay un ticket seleccionado.';
      return;
    }

    const user = this.session.user();

    if (!user) {
      this.ticketError = 'No hay un usuario en sesión.';
      return;
    }

    try {
      this.ticketManagementService.cancel(
        this.currentTicket.id,
        user.id,
        reason?.trim() || undefined
      );

      this.currentTicket = null;
      this.ticketItems = [];
      this.ticketTotal = 0;

      this.loadOpenTickets();
    } catch (error) {
      this.ticketError =
        error instanceof Error
          ? error.message
          : 'No se pudo cancelar el ticket.';
    }
  }

  deleteCurrentTicket(reason?: string): void {
    this.ticketError = '';

    if (!this.currentTicket) {
      this.ticketError = 'No hay un ticket seleccionado.';
      return;
    }

    const user = this.session.user();

    if (!user) {
      this.ticketError = 'No hay un usuario en sesión.';
      return;
    }

    try {
      this.ticketManagementService.delete(
        this.currentTicket.id,
        user.id,
        reason?.trim() || undefined
      );

      this.currentTicket = null;
      this.ticketItems = [];
      this.ticketTotal = 0;

      this.loadOpenTickets();
    } catch (error) {
      this.ticketError =
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el ticket.';
    }
  }


  openTicketActionModal(action: 'cancel' | 'delete'): void {
    this.ticketError = '';

    if (!this.currentTicket) {
      this.ticketError = 'No hay un ticket seleccionado.';
      return;
    }

    this.ticketAction = action;
    this.ticketActionReason = '';
    this.showTicketActionModal = true;
  }

  closeTicketActionModal(): void {
    this.showTicketActionModal = false;
    this.ticketAction = null;
    this.ticketActionReason = '';
  }


  confirmTicketAction(): void {
    this.ticketError = '';

    if (!this.currentTicket) {
      this.ticketError = 'No hay un ticket seleccionado.';
      this.closeTicketActionModal();
      return;
    }

    if (!this.ticketAction) {
      this.closeTicketActionModal();
      return;
    }

    const reason = this.ticketActionReason.trim();

    if (this.ticketAction === 'cancel') {
      this.cancelCurrentTicket(reason || undefined);
    } else {
      this.deleteCurrentTicket(reason || undefined);
    }

    if (!this.ticketError) {
      this.closeTicketActionModal();
    }
  }

  // Abrir modal de cobro
  openCheckout(): void {

    this.checkoutError = '';

    if (!this.currentTicket) {
      this.checkoutError = 'No hay un ticket abierto.';
      return;
    }

    if (this.ticketItems.length === 0) {
      this.checkoutError = 'El ticket no tiene productos.';
      return;
    }

    this.paymentMethod = 'cash';
    this.paymentReference = '';

    this.showCheckoutModal = true;
  }

  // Cerrar modal de cobro
  closeCheckout(): void {

    this.showCheckoutModal = false;

    this.checkoutError = '';
    this.paymentReference = '';
  }

  // Seleccionar método de pago
  selectPaymentMethod(
    paymentMethod: 'cash' | 'card' | 'transfer'
  ): void {

    this.paymentMethod = paymentMethod;

    this.paymentReference = '';
    this.checkoutError = '';
  }

  confirmCheckout(): void {

    this.checkoutError = '';

    if (!this.currentTicket) {
      this.checkoutError = 'No hay un ticket abierto.';
      return;
    }

    if (
      (this.paymentMethod === 'card' || this.paymentMethod === 'transfer') &&
      !this.paymentReference.trim()
    ) {
      this.checkoutError =
        this.paymentMethod === 'card'
          ? 'Debe ingresar la referencia del pago con tarjeta.'
          : 'Debe ingresar la referencia de la transferencia.';
      return;
    }

    try {

      this.checkoutService.checkout(
        this.currentTicket.id,
        this.paymentMethod,
        this.paymentReference.trim() || undefined
      );

      // El ticket ya fue pagado correctamente.
      this.currentTicket = null;
      this.ticketItems = [];
      this.ticketTotal = 0;
      this.ticketError = '';

      this.loadOpenTickets();

      this.closeCheckout();

    } catch (error) {

      this.checkoutError =
        error instanceof Error
          ? error.message
          : 'No se pudo completar el pago.';
    }
  }

  // Abrir el menú lateral
  async openMenu(): Promise<void> {

    await this.menuController.open();

  }

  // Cerrar el menú lateral e ir a la página de gestión de categorías
  async goToCategories(): Promise<void> {

    await this.menuController.close();

    await this.router.navigate(['/category-management']);

  }

  // Cerrar el menú lateral e ir a la página de gestión de productos
  async goToProducts(): Promise<void> {

    await this.menuController.close();

    await this.router.navigate(['/product-management']);

  }

  // Cerrar el menú lateral e ir a la página de gestión de inventario
  async goToInventory(): Promise<void> {

    await this.menuController.close();

    await this.router.navigate(['/inventory-management']);

  }


  // Cerrar el menú lateral e ir a la página de caja y turnos
  async goToCashManagement(): Promise<void> {

    await this.menuController.close();

    await this.router.navigate(['/cash-management']);

  }

  // Cerrar el menú lateral e ir a la página de work desk
  async goToWorkDesk(): Promise<void> {

    await this.menuController.close();

  }

}