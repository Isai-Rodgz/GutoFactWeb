import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/sharet/component/header/header.component';
import { CustomInputComponent } from 'src/app/sharet/component/custom-input/custom-input.component';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { ShiftService } from 'src/app/services/shift.service';
import { CashMovementService } from 'src/app/services/cash-movement.service';
import { SaleService } from 'src/app/services/sale.service';
import { TicketService } from 'src/app/services/ticket.service';
import { TicketItemService } from 'src/app/services/ticket-item.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-work-desk',
  templateUrl: './work-desk.page.html',
  styleUrls: ['./work-desk.page.scss'],
  imports: [IonicModule, HeaderComponent, CustomInputComponent, JsonPipe,RouterLink]
})
export class WorkDeskPage implements OnInit {

  //Metodo para Cerrar Cesion

  logout() {

  this.auth.logout();
  this.router.navigate(['/mainpage']);

  }

  constructor(private auth: AuthService,
  private router: Router, public session: SessionService,
  private shiftService: ShiftService,private cashMovementService: CashMovementService,
  private saleService: SaleService, private ticketService: TicketService, 
  private ticketItemService:TicketItemService, private checkoutService: CheckoutService,
  private productService: ProductService) { }

  ngOnInit() {

    
 const user = this.session.user();

  if (!user) {
    console.log('No hay usuario en sesión');
    return;
  }

  const shift = this.shiftService.getOpenShift();

  if (!shift) {
    console.log('No hay ningún turno abierto');
    return;
  }

  const product = this.productService.create(
  'Hamburguesa',
  300,
  150,
  20,
  'usuario-1'
);

console.log('PRODUCTO ORIGINAL:', product);

const ticket =
  this.ticketService.create(
    'shift-1',
    'usuario-1'
  );

console.log('TICKET:', ticket);

const item =
  this.ticketItemService.add(
    ticket.id,
    product.id,
    2
  );

console.log('ITEM ANTES DEL CAMBIO:', item);


const updatedProduct =
  this.productService.update(
    product.id,
    'usuario-2',
    {
      price: 350
    }
  );

console.log(
  'PRODUCTO DESPUÉS DEL CAMBIO:',
  updatedProduct
);




const oldItem =
  this.ticketItemService.getById(
    item.id
  );

console.log(
  'ITEM HISTÓRICO:',
  oldItem
);




const newTicket =
  this.ticketService.create(
    'shift-1',
    'usuario-1'
  );

const newItem =
  this.ticketItemService.add(
    newTicket.id,
    product.id,
    2
  );

console.log(
  'NUEVO ITEM:',
  newItem
);


  }

}

