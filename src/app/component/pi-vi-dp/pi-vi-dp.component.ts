import { Component, OnInit } from '@angular/core';
import { sum } from 'lib-r-math.js/dist/src/lib/r-func';

@Component({
  selector: 'app-pi-vi-dp',
  templateUrl: './pi-vi-dp.component.html',
  styleUrls: ['./pi-vi-dp.component.css']
})
export class PIVIDPComponent implements OnInit {
  states: number = 0;
  states_arr: any = [];
  actions: number = 0;
  actions_arr: any = [];
  PI:any=[];
  objPolicyIteration: any=[];
  p: any[];
  r: any[];
  p_r: any[];
  diagram_arr: any[];
  aux: number = 1;
  // example_2_p: any = [[[-1, 100, -1, -1, -1], [-1, -1, 50, -1, -1], [-1, -1, -1, 50, -1], [-1, -1, -1, -1, 50], [-1, -1, -1, -1, -1]], [[-1, -1, -1, -1, -1], [50, -1, -1, -1, -1], [-1, 50, -1, -1, -1], [-1, -1, 50, -1, -1], [-1, -1, -1, 100, -1]]];
  // example_2_r: any = [[[null, 5, null, null, null], [0, null, 0, null, null], [null, null, null, 0, null], [null, null, null, null, -10], [null, null, null, null, null]], [[null, null, null, null, null], [0, null, null, null, null], [null, 5, null, null, null], [null, null, 0, null, null], [null, null, null, 0, null]]];
  example_2_p:any=[[[-1,100,-1],[-1,-1,-1],[-1,-1,-1]],[[-1,-1,100],[-1,-1,-1],[-1,-1,-1]]];
  example_2_r:any=[[[null,1,null],[null,null,null],[null,null,null]],[[null,null,1],[null,null,null],[null,null,null]]];
  example_p: any = [
    [
      [10, 90],
      [-10, -10]
    ],
    [
      [-10, -10],
      [60, 40]
    ],
    [
      [-10, -10],
      [10, -10]
    ]
  ];
  example_r: any = [
    [
      [3, 4],
      [null, null]
    ],
    [
      [null, null],
      [6, 7]
    ],
    [
      [null, null],
      [5, null]
    ]
  ];
  constructor() {
  }

  ngOnInit() {
  }

  fchange(type: string, val: number) {

    switch (type) {
      case "actions":        
        this.p = new Array(val);
        this.r = new Array(val);
        this.actions_arr=new Array(this.actions);
        break;
      case "states":
        if (this.p.length != 0) {

          for (let index = 0; index < this.p.length; index++) {
            let s_row = new Array(val);
            let s_row_r = new Array(val);
            for (let index = 0; index < s_row.length; index++) {
              let col = new Array(val);
              let col_r = new Array(val);
              col.fill(0);
              col_r.fill(null);
              s_row[index] = col;
              s_row_r[index] = col_r;
            }
            this.p[index] = s_row;
            this.r[index] = s_row_r;
          }
        }

        break;

      default:
        break;
    }

  }

  example() {
    this.actions_arr=[0.3,0.3,0.3];
    this.actions = 3;
    this.states = 2;
    this.p = [...this.example_p];
    this.r = [...this.example_r];
  }

  example_2() {
    // this.actions = 2;
    // this.states = 5;
    this.actions_arr=[0.5,0.5];
    this.actions = 2;    
    this.states = 3;
    this.p = [...this.example_2_p];
    this.r = [...this.example_2_r];
  }

  generarMapa() {
    console.log(JSON.stringify(this.p));
    console.log(JSON.stringify(this.r));
    this.diagram_arr = new Array();
    this.p_r = new Array(this.actions);
    for (let index = 0; index < this.actions; index++) {
      this.p_r[index] = new Array(this.states);

      for (let index_i = 0; index_i < this.states; index_i++) {
        this.p_r[index][index_i] = new Array(this.states);
        this.diagram_arr.push({
          data: { id: 'S_' + index_i }, classes: 'estado'
        });
        for (let index_j = 0; index_j < this.states; index_j++) {
          this.p_r[index][index_i][index_j] = {
            'p': this.p[index][index_i][index_j],
            'r': this.r[index][index_i][index_j]
          }
          if (this.p[index][index_i][index_j] >= 0) {
            this.diagram_arr.push({
              data: { id: 'S_' + index_i + ':A_' + index, source: 'S_' + index_i, target: 'A_' + index }
            });
            this.diagram_arr.push({
              data: { id: '{p:' + this.p[index][index_i][index_j] + ';r:' + this.r[index][index_i][index_j], source: 'A_' + index, target: 'S_' + index_j }
            });
          }

        }
      }
      this.diagram_arr.push({
        data: { id: 'A_' + index }, classes: 'accion'
      });
    }
    if (this.aux == 1) {
      this.aux = 0;
    } else {
      this.aux = 1;
    }

    // this.objPolicyIteration = this.policyIteration(this.states, this.actions, this.p_r, 0.1, 1);
    let PI=this.policyRandom(this.p_r,this.states,this.actions_arr);
    console.log("PI_RM",PI);
    console.log("PI,generadas",this.policyImprovement(this.p_r,this.states,1.0,this.clone(PI))[0]);

  }



  policyRandom(MDP,S,actions_p){
    const _MDP=MDP;
    const _A=MDP.length;
    const _actions_p=actions_p;
    const _S=S;
    let PI_random=new Array(_S);
    for (let i_s = 0; i_s < S; i_s++) {
      const actions=this.allowedActions(i_s,_MDP);
      const arrAct=new Array(_A);
      PI_random[i_s]=arrAct;
      for (let i_a = 0; i_a < _A; i_a++) {        
        if(actions.includes(i_a))
        {          
          let o={
                "v":0,
                "p_a":_actions_p[i_a]
              };           
          PI_random[i_s][i_a]=o;
        }else{
          PI_random[i_s][i_a]=null;
        }
      }

    }
    return PI_random;

  }
  policyEvaluation(PI, MDP, S, gamma=1.0, theta=0.00001) {    
    // PI:es un arreglo de S filas, por A columnas, donde se almacenan las probabilidades de cada par estado - accion PI(A|S)        
    let _S = S;
    const _PI = PI;
    console.log(":PI",_PI);
    let _delta = 0;
    let _theta=theta;
    let V=new Array(_S);
    let V_old_arr=new Array();
    V.fill(0);
    do{
      _delta=0;
      for (let s = 0; s < S; s++) {
        let v=V[s];
        // const element = S[s];
        // allowedActions(estado,MDP), me devuelve las acciones para el estado s
        // s_a, arreglo de acciones para s
        const s_a = this.allowedActions(s, MDP);        
        let sum_total=0;
        for (let a = 0; a < s_a.length; a++) {
          // _a: indice de accion
          const _a = s_a[a];          
          const probability_a_in_s=_PI[s][_a]["p_a"];          
          // this.nextStates(estado,accion,MDP), me devuelve un array de estado_prima,probabilidad_prima y r_prima  -  que obtengo de realizar la accion a en estado s 
          // prima_states: array de [estados_prima,probabilidad_s_s',r_s']  de s aplicando a
          const prima_states=this.nextStates(s,_a,MDP); 
          let sum_v=0;                   
          prima_states.forEach((_s,i)=>{
            const s_prima=_s[0];
            const _p=_s[1];
            const _r=_s[2]            
            sum_v+=_p*(_r + (gamma*V[s_prima]));                        
          });          
          sum_total+=probability_a_in_s*sum_v;                    
        }
        V[s]=sum_total;        
        _delta = Math.max(_delta, Math.abs(v - V[s]))                
        // console.log(V);
      }      
      V_old_arr.push();
    }while(_delta>_theta)      

    console.log("FINAL",V);
    return [V,V_old_arr];
  }

  policyImprovement(MDP,S,gamma=1.0,_PI)
  {    
    let V=new Array(S);
    V.fill(0);        
    let PI=this.clone(_PI);  
    let k=0;  
    while(true)
    {
      V=this.clone(this.policyEvaluation(PI,MDP,S,gamma,0.0001)[0]);      
      let _policy_stable=true;  
      
      for (let s = 0; s < S; s++) {
        let old_action=this.getAction(PI[s]);//obtenemos la accion con probabilidad maxima del estado s 
        console.log("oldAct",old_action);     
        const q_s_a=this.actionValues(s,MDP,V,gamma);
        
        
        // se itera los valores incluyendo el valor maximo obtenidos para asignarlos a la política              
        q_s_a.forEach((v_s,a)=>{
          const _v_s=v_s;
          if(PI[s][a]!=null)
            PI[s][a]["v"]=_v_s;
        }); 
        const best_action=this.getAction(PI[s]);
        console.log("Q_S_A",q_s_a);
        console.log("BEST_ACTO",best_action);
        console.log("compare actions");
        console.log(old_action,best_action);
        if(old_action!=best_action)
        {
          _policy_stable=false;
        }
      }
      if(_policy_stable || k==10){
        return [PI, V]
      }
      k++;
    }                
            
  }
  actionValues(s,MDP,V,gamma){  

    const s_a = this.allowedActions(s, MDP);//obtenemos las acciones que se permiten en este estado

    let A_values=new Array(s_a.length); 
    A_values.fill(0);   
    for (let a = 0; a < s_a.length; a++) {        
      const _a=s_a[a];
      const prima_states=this.nextStates(s,_a,MDP);//obtiene los estados prima de s aplicando a
      prima_states.forEach((s_prima)=>{
        const _s_prima=s_prima[0];
        const s_prima_p=s_prima[1];
        const s_prima_r=s_prima[2];  
        A_values[a]+=s_prima_p*(s_prima_r+(gamma*V[_s_prima]));      
      });
    }    
    return A_values;
  }
  getAction(PI_s:any[])
  {
    console.log("PI_GET:AC",PI_s);
    const pi=PI_s;
    let _PI_s=new Array(pi.length);
    PI_s.forEach((obj_v_p,i)=>{
      console.log("obj_v_p",obj_v_p);
      if(obj_v_p!=null)
      { 
        if (obj_v_p.hasOwnProperty("v")) {
          const element = obj_v_p["v"];
          _PI_s[i]=element ;
        }
      }      
    });
    let max_act=_PI_s.indexOf(Math.max(..._PI_s))
    if(max_act>=0)
    {
      return max_act;
    }else{
      return null;
    }
  }
  nextStates(s,a,MDP)
  {
    let _next_states=[];
    const _s=s;
    const _a=a;
    const _a_s=MDP[a][s];
    _a_s.forEach((s_prima,i)=> {
      if(s_prima.p>=0)
      {
        _next_states.push([i,s_prima.p,s_prima.r]);
      }   
    });
    return _next_states;
  }
  allowedActions(s, MDP) {
    let _a_allowed = [];    
    
    for (let a = 0; a < MDP.length; a++) {      
      let cont = 0;
      let is_accion = false;

      const _a = MDP[a];      
      const i_s = _a[s];            
      while (!is_accion && cont < _a.length) {        
        const p = i_s[cont].p;        
        if (p >= 0) {
          _a_allowed.push(a);
          is_accion = true;
        }
        cont++;
      }
    }
    return _a_allowed;
  }

  clone(obj){
    //  clona objetos para evitar que ambos objetos tengan la misma referencia
    return JSON.parse(JSON.stringify(obj));
  }

  noEqualPolicy(PI_s, PI_old) {
    console.log(PI_s, PI_old);
    for (var i = 0; i < PI_s.length; i++)
      if (PI_s[i][0] != PI_old[i][0])
        return true;
    return false;
  }
}
