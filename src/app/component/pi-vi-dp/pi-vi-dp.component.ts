import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pi-vi-dp',
  templateUrl: './pi-vi-dp.component.html',
  styleUrls: ['./pi-vi-dp.component.css']
})
export class PIVIDPComponent implements OnInit {
  states:number=0;
  states_arr:any=[];  
  actions:number=0;
  actions_arr:any=[];  
  p:any[];
  r:any[];
  p_r:any[];
  diagram_arr:any[];
  aux:number=1;
  example_p:any=[
    [
      [10,90],
      [-10,-10]
    ],
    [
      [-10,-10],
      [60,40]
    ],
    [
      [-10,-10],
      [10,-10]
    ]    
  ];
  example_r:any=[
    [
      [3,4],
      [null,null]
    ],
    [
      [null,null],
      [6,7]
    ],
    [
      [null,null],
      [5,null]
    ]    
  ];
  constructor() {     
  }

  ngOnInit() {    
  }

  fchange(type:string,val:number)
  {
    
    switch (type) {
      case "actions":
          // this.actions_arr.length=val;
          this.p=new Array(val);
          this.r=new Array(val);
        break;
      case "states":                        
          if(this.p.length!=0)
          {
                                   
              for (let index = 0; index < this.p.length; index++) { 
                let s_row=new Array(val);                                                                                    
                let s_row_r=new Array(val);                                                                                    
                for (let index = 0; index < s_row.length; index++) {
                  let col=new Array(val);
                  let col_r=new Array(val);
                  col.fill(0);  
                  col_r.fill(null);         
                  s_row[index]=col;
                  s_row_r[index]=col_r;
                }                
                this.p[index]=s_row;   
                this.r[index]=s_row_r;   
              }                                      
          }          

        break;
    
      default:
        break;      
    }
    
  }

  example(){
    this.actions=3;
    this.states=2;
    this.p=[...this.example_p];
    this.r=[...this.example_r];
  }

  generarMapa()
  {
    this.diagram_arr=new Array();
    this.p_r=new Array(this.actions); 
    for (let index = 0; index < this.actions; index++) {
      this.p_r[index]=new Array(this.states);
      
      for (let index_i = 0; index_i < this.states; index_i++) { 
        this.p_r[index][index_i]=new Array(this.states);
        this.diagram_arr.push( { 
          data: { id: 'S_'+index_i},classes:'estado'
        });
        for (let index_j = 0; index_j < this.states; index_j++) { 
            this.p_r[index][index_i][index_j]={
              'p':this.p[index][index_i][index_j],
              'r':this.r[index][index_i][index_j]
            }
            if(this.p[index][index_i][index_j]>=0)
            {
              this.diagram_arr.push({ 
                data: { id: 'S_'+index_i+':A_'+index, source: 'S_'+index_i, target: 'A_'+index}
              });
              this.diagram_arr.push({ 
                data: { id: '{p:'+this.p[index][index_i][index_j]+';r:'+this.r[index][index_i][index_j], source: 'A_'+index, target: 'S_'+index_j }
              });
            }
            
          }
      }
      this.diagram_arr.push({
        data: { id: 'A_'+index},classes:'accion'
      });
    }
    if(this.aux==1){
      this.aux=0;
    }else{
      this.aux=1;
    }    
  }


  policyIteration(s,a,MDP,teta)
  {
    // s: número de estados
    // a: número de acciones
    let policy_stable=true;
    let PI_s=new Array(s);
    PI_s.fill(0);
    let V_s=new Array(s);
    V_s.fill(0);

  }

}
