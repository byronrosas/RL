import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import cytoscape from 'cytoscape';
@Component({
  selector: 'app-markov-map',
  templateUrl: './markov-map.component.html',
  styleUrls: ['./markov-map.component.css']
})
export class MarkovMapComponent implements OnInit {
  @Input() indAux: any;
  private _indAux: any;

  @Input() ele:any;

  constructor() { }

  
  ngOnChanges(changes) {        
    const _indAux: SimpleChange = changes.indAux;
    console.log(changes);
    console.log('prev value: ', _indAux.previousValue);
    console.log('got objGraphicData: ', _indAux.currentValue);  
    if( _indAux.currentValue!=undefined)
    {            
      // var cy = cytoscape({
      //   container: document.getElementById('cy'), // container to render in,
      //   elements: [ // list of graph elements to start with
      //     { // node a
      //       data: { id: 'a'},classes:'estado'
      //     },
      //     { // node b
      //       data: { id: 'b'},classes:'estado'
      //     },        
      //     { // node b
      //       data: { id: 'c'},classes:'estado'
      //     },
      //     { // node b
      //       data: { id: 'accion'},classes:'accion'
      //     },
      //     { // edge ab
      //       data: { id: 'a-accion', source: 'a', target: 'accion' }
      //     },
      //     { // edge ab
      //       data: { id: 'accion-b', source: 'accion', target: 'b' }
      //     },
      //     { // edge ab
      //       data: { id: 'accion-c', source: 'accion', target: 'c' }
      //     }
      //   ],
      
      //   style: [ // the stylesheet for the graph
      //     {
      //       selector: '.estado',
      //       style: {            
      //         'background-color': '#666',
      //         'label': 'data(id)'
      //       }
      //     },
      //     {
      //       selector: '.accion',
      //       style: {            
      //         'background-color': '#000',
      //         'label': 'data(id)'
      //       }
      //     },
      
      
      //     {
      //       selector: 'edge',
      //       style: {
      //         'width': 3,
      //         'line-color': '#ccc',
      //         'target-arrow-color': '#ccc',
      //         'curve-style': 'bezier',
      //         'taxi-turn-min-distance':'10px',
      //         'target-arrow-shape': 'triangle',
      //         'arrow-scale':2,
      //         'label': 'data(id)'
      //       }
      //     }
      //   ],
      
      //   layout: {
      //     name: 'circle',
      //     rows: 1,
      //     nodeSep:8
      //   }
      
      // });      
      var cy = cytoscape({
        container: document.getElementById('cy'), // container to render in,
        elements:this.ele,
      
        style: [ // the stylesheet for the graph
          {
            selector: '.estado',
            style: {            
              'background-color': '#666',
              'label': 'data(id)'
            }
          },
          {
            selector: '.accion',
            style: {            
              'background-color': '#000',
              'label': 'data(id)'
            }
          },
      
      
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'curve-style': 'bezier',
              'taxi-turn-min-distance':'10px',
              'target-arrow-shape': 'triangle',
              'arrow-scale':2,
              'label': 'data(id)'
            }
          }
        ],
      
        layout: {
          name: 'circle',
          rows: 1,
          nodeSep:8
        }
      
      });
    }         
  }
  ngOnInit() {
  }

}
