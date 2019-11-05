import { Component, OnInit } from '@angular/core';
import * as rmathlib from 'lib-r-math.js';

import { ChartOptions, ChartType, ChartDataSets, plugins } from 'chart.js';
import { Label } from 'ng2-charts';

const {
  Beta,
  rng: {
      LecuyerCMRG,
      normal: { Inversion }
  },
  R: { multiplex, numberPrecision }
} = rmathlib;

//helpers
const ln = multiplex(Math.log); //
const _9 = numberPrecision(9);

const lc = new LecuyerCMRG(0);
const { dbeta, pbeta, qbeta, rbeta } = Beta(new Inversion(lc));



@Component({
  selector: 'app-kbandit',
  templateUrl: './kbandit.component.html',
  styleUrls: ['./kbandit.component.css']
})
export class KBanditComponent implements OnInit {

  medicinas:number;
  pacientes:number;
  arrBtnMedicinas:any[];
  arrBtnTest:any[];
  arrBtnTest_E_GREEDY_MEAN:any[];
  arrBtnTest_E_GREEDY_INCREMENTAL:any[];
  arrBtnTest_UCB:any[];
  arrBtnTest_THOMPSON:any[];
  suma_recompensas_usuario=0; 
  arrFail:any=[0,0,0,0,0];
  arrWin:any=[0,0,0,0,0];
  valor_regret:any=[0,0,0,0,0];
  objGraphicData:any=0;
lb;
data;
DATA_USER=[];
DATA_E_GREEDY_MEAN=[];
DATA_E_GREEDY_INC=[];
DATA_UCB=[];
DATA_THOMPSON=[];

  constructor() { 
    this.medicinas=0;
    this.pacientes=0;
    this.lb=['r','q'];
    this.data=  [{ data: [20,50], label: 'Series A' }];       
    
  }

  ngOnInit() {
    
  }



  changeMedicinas()
  {
    this.valor_regret.fill(0);
    this.suma_recompensas_usuario=0; 
    this.arrBtnMedicinas=new Array(this.medicinas);
    for (let index = 0; index < this.arrBtnMedicinas.length; index++) {
      this.arrBtnMedicinas[index]=Math.floor(Math.random() * 101); //se le asigna a cada medicina la probabilidad de que salga "Exito" (paciente sobreviva)
    }            
    
    let arrBtnMedicinasFill= [...this.arrBtnMedicinas];
    this.lb=this.arrBtnMedicinas;    
    this.data= [{ data: arrBtnMedicinasFill.fill(0), label: 'User' }];    
    this.cambiarGrafico();


    this.arrBtnTest=new Array();
    this.arrBtnTest_E_GREEDY_MEAN=new Array();
    this.arrBtnTest_E_GREEDY_INCREMENTAL=new Array();
    this.arrBtnTest_UCB=new Array();    
    this.arrBtnTest_THOMPSON=new Array();
    this.EGreedyMean(this.pacientes,this.medicinas,0.2);
    this.EGreedyIncremental(this.pacientes,this.medicinas,0.2);
    this.UCB(this.pacientes,this.medicinas);
    this.thompsonSample(this.pacientes,this.medicinas);    
    
  }



  EGreedyMean(T,k,epsilon)
  {
    // T: número de tiempos
    // k: número de acciones
    // [0-1]epsilon: constante para la exploracion (probabilidad) ; 1-epsilon:probabilidad de explotacion    
    let t=0;
    // r: arreglo de sumatoria de recompensas para determinada acción, el indice es la accion; r es el valor de una accion
    let r=[];
    r.length=k;
    r.fill(0);
    // n: número de veces que la acción ha sido realizada
    let n=[...r];   
    let suma_recompensas=0; 
    while(t<T)
    {
      console.log("T_e",t); 
      // valor aleatorio entre [0-1]
      let random_prob=(Math.floor(Math.random() * 101)/100);
      console.log("random_prob",random_prob);
      if(random_prob<epsilon){               
        // explorar (ejemplo: epsilon=>0.2; random_prob=>0.1)
        // exploramos de forma aleatoria, tomamos una accion al azar
        let accion_azar=Math.floor(Math.random() * k);
        // aplicamos la accion y obtenemos un resultado
        let r_obtenido=this.tomarMedicina_egreedy_mean(accion_azar).result ? 1:0;
        suma_recompensas=suma_recompensas+r_obtenido;
        // aumentamos en uno el número de veces que se ha tomado esta acción
        n[accion_azar]++;
        // recalculamos el valor de la accion
        r[accion_azar]=(r[accion_azar]+r_obtenido)/n[accion_azar];        

        console.log("TIPO:",'exploracion');  
        console.log("ACCION_AZAR:",accion_azar+"=>"+r_obtenido); 
        console.log("RETORNO:",r[accion_azar]); 
      }else{
                 
        // explotar (ejemplo: epsilon=>0.2; random_prob=>0.4)
        // calcular la acción con mayor promedio experimental
        let max_accion=r.indexOf(Math.max(...r));
        // aplicamos la acción y obtenemos un resultado
        let r_obtenido=this.tomarMedicina_egreedy_mean(max_accion).result ? 1:0;
        suma_recompensas=suma_recompensas+r_obtenido;
        // aumentamos en uno el número de veces que se ha tomado esta acción
        n[max_accion]++;
        // recalculamos el valor de la accion
        r[max_accion]=(r[max_accion]+r_obtenido)/n[max_accion];

        console.log("TIPO:",'explotacion');
        console.log("ACCION_MAX:",max_accion+"=>"+r_obtenido); 
        console.log("RETORNO:",r[max_accion]); 
      }             
      console.log(n,r);
      t++;
    }
    this.valor_regret[1]=this.regret(this.pacientes,this.arrBtnMedicinas,suma_recompensas);    
  }



  EGreedyIncremental(T,k,epsilon)
  {
    // T: número de tiempos
    // k: número de acciones
    // [0-1]epsilon: constante para la exploracion (probabilidad) ; 1-epsilon:probabilidad de explotacion    
    let t=0;
    // q: arreglo de sumatoria de recompensas para determinada acción, el indice es la accion; q es el valor de una accion
    let q=[];
    q.length=k;
    q.fill(0);
    // n: número de veces que la acción ha sido realizada
    let n=[...q];  
    let suma_recompensas=0;  
    while(t<T)
    {
      console.log("T_e",t); 
      // valor aleatorio entre [0-1]
      let random_prob=(Math.floor(Math.random() * 101)/100);
      console.log("random_prob",random_prob);
      if(random_prob<epsilon){               
        // explorar (ejemplo: epsilon=>0.2; random_prob=>0.1)
        // exploramos de forma aleatoria, tomamos una accion al azar
        let accion_azar=Math.floor(Math.random() * k);
        // aplicamos la accion y obtenemos un resultado
        let r_obtenido=this.tomarMedicina_egreedy_inc(accion_azar).result ? 1:0;
        suma_recompensas=suma_recompensas+r_obtenido;
        // aumentamos en uno el número de veces que se ha tomado esta acción
        n[accion_azar]++;
        // recalculamos el valor de la accion
        q[accion_azar]=q[accion_azar]+((r_obtenido-q[accion_azar])/n[accion_azar]);        

        console.log("TIPO:",'exploracion');  
        console.log("ACCION_AZAR:",accion_azar+"=>"+r_obtenido); 
        console.log("RETORNO:",q[accion_azar]); 
      }else{
                 
        // explotar (ejemplo: epsilon=>0.2; random_prob=>0.4)
        // calcular la acción con mayor promedio experimental
        let max_accion=q.indexOf(Math.max(...q));
        // aplicamos la acción y obtenemos un resultado
        let r_obtenido=this.tomarMedicina_egreedy_inc(max_accion).result ? 1:0;
        suma_recompensas=suma_recompensas+r_obtenido;
        // aumentamos en uno el número de veces que se ha tomado esta acción
        n[max_accion]++;
        // recalculamos el valor de la accion
        q[max_accion]=q[max_accion]+((r_obtenido-q[max_accion])/n[max_accion]);

        console.log("TIPO:",'explotacion');
        console.log("ACCION_MAX:",max_accion+"=>"+r_obtenido); 
        console.log("RETORNO:",q[max_accion]); 
      }             
      console.log(n,q);
      t++;
    }
    this.valor_regret[2]=this.regret(this.pacientes,this.arrBtnMedicinas,suma_recompensas);    
  }

  UCB(T,k)
  {
    let t=0;
    let suma_recompensas=0; 
    let q=[];
    q.length=k;
    q.fill(0);

    // n: número de veces que una acción ha sido tomada
    let n=[...q];
    let a =new Array(k);
    let UCB=new Array(k);
    for (let index = 0; index < k; index++) {      
      q[index]=this.tomarMedicina_UCB(index).result ? 1:0; 
      suma_recompensas=suma_recompensas+q[index];
      n[index]++;
      t++;
    }    
    while(t<T)
    {
      for (let index = 0; index < k; index++) {      
        a[index]=Math.sqrt((2*(Math.log(T)))/n[index]); 
        UCB[index]=q[index]+a[index];
      }
      let accion_max=UCB.indexOf(Math.max(...UCB));
      let r_obtenido=this.tomarMedicina_UCB(accion_max).result ? 1:0;
      suma_recompensas=suma_recompensas+r_obtenido;
        // aumentamos en uno el número de veces que se ha tomado esta acción
        n[accion_max]++;
        // recalculamos el valor de la accion
        q[accion_max]=(q[accion_max]+r_obtenido)/n[accion_max];
      t++;
    }
    this.valor_regret[3]=this.regret(this.pacientes,this.arrBtnMedicinas,suma_recompensas);    
  }

  thompsonSample(T,k)
  {      
    let alfa=0;
    let beta=0;
    // para toda accion se iguala un contador de exito S:(success)
    let S=new Array(k);
    S.fill(0);
    // para toda accion se iguala un contador de fracaso F:(failure)
    let F=new Array(k);
    F.fill(0);

    let t=0;

    //teta: variable aleatoria de cada acción, obtenida de la distribución beta, con parametros (alfa+número de exitos de la accion, beta + número de fracasos de la accion)
    let teta=new Array(k);
    teta.fill(0);

    // recompensa obtenida al aplicar un accion
    let r=0;
    
    let suma_recompensas=0; 
    while(t<T)
    {
      for (let index = 0; index < k; index++) {        
        teta[index] = _9(rbeta(1,S[index]+alfa,F[index]+beta));        
      }

      let max_accion=teta.indexOf(Math.max(...teta));
      r=this.tomarMedicina_THOMPSON(max_accion).result ? 1 : 0;
      suma_recompensas=suma_recompensas+r;
      if(r==1)
      {
        S[max_accion]=S[max_accion]+1;
      }else{
        F[max_accion]=F[max_accion]+1;
      }

      t++;
    }    
    this.valor_regret[4]=this.regret(this.pacientes,this.arrBtnMedicinas,suma_recompensas);    
  }

  regret(T,pr,suma_recompensas_algoritmo){
    // Pr(r|a): probabilidad de que dado una acción, nos de una recompensa determinada, en este caso la positiva
    let k=[...pr];
    let t=0;
    let resultado=0;
    let sum_recompensas=0;
    // Obtenemos la acción (máquina) que nos da la mayor recompensa, en este caso la recompensa que tiene mayor probabilidad de ser true
    let max_p_accion=k.indexOf(Math.max(...k));          


    while(t<T)
    {
      resultado=this.tomarMedicina_optima(max_p_accion).result ? 1:0;
      sum_recompensas=(sum_recompensas+resultado);    
      t++;
    }
    let regretE=((T*sum_recompensas)/t)-((suma_recompensas_algoritmo)/t);
    console.log("REGRET",regretE);
    return ((T*sum_recompensas)/t)-((suma_recompensas_algoritmo)/t); 
    
  }
  

  clickMedicina(i)
  { 
    this.arrFail[0]=0;
    this.arrWin[0]=0;
    
    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
    this.suma_recompensas_usuario=this.suma_recompensas_usuario+(r ? 1 : 0); 
    let T=[...this.arrBtnMedicinas];             
    T.fill(0);
    this.DATA_USER=[];
    this.arrBtnTest.push({
      medicina:i,
      result: r
    });
    this.arrBtnTest.forEach((obj)=>{            
      if(obj.result)
      {
        T[obj.medicina]=T[obj.medicina]+1;        
        this.arrWin[0]++;
      }else{
        this.arrFail[0]++;
      }
    });      
    T.forEach((t)=>{
      this.DATA_USER.push(t/this.arrBtnTest.length);
    });


    this.valor_regret[0]=this.regret(this.pacientes,this.arrBtnMedicinas,this.suma_recompensas_usuario);    
    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC,this.DATA_UCB,this.DATA_THOMPSON);
  }

  tomarMedicina_egreedy_mean(i)
  {
    this.arrFail[1]=0;
    this.arrWin[1]=0;

    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
    let T=[...this.arrBtnMedicinas];             
    T.fill(0);
    this.DATA_E_GREEDY_MEAN=[];
    var o ={
      medicina:i,
      result: r
    }
    this.arrBtnTest_E_GREEDY_MEAN.push(o);
    this.arrBtnTest_E_GREEDY_MEAN.forEach((obj)=>{            
      if(obj.result)
      {
        T[obj.medicina]=T[obj.medicina]+1;
        this.arrWin[1]++;
      }else{
        this.arrFail[1]++;
      }  
    });      
    T.forEach((t)=>{
      this.DATA_E_GREEDY_MEAN.push(t/this.arrBtnTest_E_GREEDY_MEAN.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC,this.DATA_UCB,this.DATA_THOMPSON);
    return o;
  }


  tomarMedicina_egreedy_inc(i)
  {
    this.arrFail[2]=0;
    this.arrWin[2]=0;

    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
    let T=[...this.arrBtnMedicinas];             
    T.fill(0);
    this.DATA_E_GREEDY_INC=[];
    var o ={
      medicina:i,
      result: r
    }
    this.arrBtnTest_E_GREEDY_INCREMENTAL.push(o);
    this.arrBtnTest_E_GREEDY_INCREMENTAL.forEach((obj)=>{            
      if(obj.result)
      {
        T[obj.medicina]=T[obj.medicina]+1;
        this.arrWin[2]++;
      }else{
        this.arrFail[2]++;
      }      
    });      
    T.forEach((t)=>{
      this.DATA_E_GREEDY_INC.push(t/this.arrBtnTest_E_GREEDY_INCREMENTAL.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC,this.DATA_UCB,this.DATA_THOMPSON);
    return o;
  }


  tomarMedicina_UCB(i)
  {
    this.arrFail[3]=0;
    this.arrWin[3]=0;


    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
    let T=[...this.arrBtnMedicinas];             
    T.fill(0);
    this.DATA_UCB=[];
    var o ={
      medicina:i,
      result: r
    }
    this.arrBtnTest_UCB.push(o);
    this.arrBtnTest_UCB.forEach((obj)=>{            
      if(obj.result)
      {
        T[obj.medicina]=T[obj.medicina]+1;
        this.arrWin[3]++;
      }else{
        this.arrFail[3]++;
      }      
    });      
    T.forEach((t)=>{
      this.DATA_UCB.push(t/this.arrBtnTest_UCB.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC,this.DATA_UCB,this.DATA_THOMPSON);
    return o;
  }

  tomarMedicina_THOMPSON(i)
  {
    this.arrFail[4]=0;
    this.arrWin[4]=0;


    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
    let T=[...this.arrBtnMedicinas];             
    T.fill(0);
    this.DATA_THOMPSON=[];
    var o ={
      medicina:i,
      result: r
    }
    this.arrBtnTest_THOMPSON.push(o);
    this.arrBtnTest_THOMPSON.forEach((obj)=>{            
      if(obj.result)
      {
        T[obj.medicina]=T[obj.medicina]+1;
        this.arrWin[4]++;
      }else{
        this.arrFail[4]++;
      }      
    });      
    T.forEach((t)=>{
      this.DATA_THOMPSON.push(t/this.arrBtnTest_THOMPSON.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC,this.DATA_UCB,this.DATA_THOMPSON);
    return o;
  }


  tomarMedicina_optima(i)
  {    
    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;            
    var o ={
      medicina:i,
      result: r
    }    
    return o;
  }


  graficar(DATA_USER,DATA_E_GREEDY_MEAN,DATA_E_GREEDY_INC,DATA_UCB,DATA_THOMPSON)
  {
    
    this.data= [{ data:DATA_USER, label: 'Usuario' },
                { data:DATA_E_GREEDY_MEAN, label: 'E_GREEDY_MEAN' },
                { data:DATA_E_GREEDY_INC, label: 'E_GREEDY_INC'},
                { data:DATA_UCB,label:'UCB'},
                { data:DATA_THOMPSON,label:'Thompson'}];                 
    this.cambiarGrafico();              
  }


  cambiarGrafico()
  {
    if(this.objGraphicData==0)
    {
      this.objGraphicData=1;
    }else{
      this.objGraphicData=0;
    }    
  }
}
