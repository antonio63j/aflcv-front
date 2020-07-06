import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {

  @Input() detalleCliente: any;
  constructor() { }

  ngOnInit() {

    // console.log(this.detalleCliente);
  }

}
