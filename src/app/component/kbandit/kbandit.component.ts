import { Component, OnInit } from '@angular/core';


import { ChartOptions, ChartType, ChartDataSets, plugins } from 'chart.js';
import { Label } from 'ng2-charts';
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
  objGraphicData:any=0;
lb;
data;
DATA_USER=[];
DATA_E_GREEDY_MEAN=[];
DATA_E_GREEDY_INC=[];
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

    this.EGreedyMean(this.pacientes,this.medicinas,0.2);
    this.EGreedyIncremental(this.pacientes,this.medicinas,0.2);
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
  }

  UCB(T,k)
  {
    
  }

  

  clickMedicina(i)
  {       
    let r = Math.floor(Math.random() * 101) < this.arrBtnMedicinas[i] ? true : false;    
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
      }      
    });      
    T.forEach((t)=>{
      this.DATA_USER.push(t/this.arrBtnTest.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC);
  }

  tomarMedicina_egreedy_mean(i)
  {
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
      }      
    });      
    T.forEach((t)=>{
      this.DATA_E_GREEDY_MEAN.push(t/this.arrBtnTest_E_GREEDY_MEAN.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC);
    return o;
  }


  tomarMedicina_egreedy_inc(i)
  {
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
      }      
    });      
    T.forEach((t)=>{
      this.DATA_E_GREEDY_INC.push(t/this.arrBtnTest_E_GREEDY_INCREMENTAL.length);
    });

    this.graficar(this.DATA_USER,this.DATA_E_GREEDY_MEAN,this.DATA_E_GREEDY_INC);
    return o;
  }

  graficar(DATA_USER,DATA_E_GREEDY_MEAN,DATA_E_GREEDY_INC)
  {
    
    this.data= [{ data:DATA_USER, label: 'Usuario' },
                { data:DATA_E_GREEDY_MEAN, label: 'E_GREEDY_MEAN' },
                { data:DATA_E_GREEDY_INC, label: 'E_GREEDY_INC' }];                 
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
