import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {

  @Input() detalleCliente: any;
  host: string = environment.urlEndPoint;
  constructor() { }

  ngOnInit() {

    // console.log(this.detalleCliente);
  }

}
