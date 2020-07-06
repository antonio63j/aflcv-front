import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proyecto-estado-visor',
  templateUrl: './proyecto-estado-visor.component.html',
  styleUrls: ['./proyecto-estado-visor.component.css']
})
export class ProyectoEstadoVisorComponent implements OnInit {

  @Input() erroresValidacion: string [];
  constructor() { }

  ngOnInit() {
  }

}
