import { Label } from 'ng2-charts';
import { Component, OnInit,Input, SimpleChange } from '@angular/core';
@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent implements OnInit {
  @Input() objGraphicData: any;
  private _objGraphicData: any;
  @Input() lb: any;
  @Input() data: any;  
    

  public barChartOptions: any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[];
  public barChartType: string = 'bar';
  public barChartLegend = true;

  public barChartData: any[];
  constructor() {}


  ngOnChanges(changes) {        
    const _objGraphicData: SimpleChange = changes.objGraphicData;
    console.log(changes);
    console.log('prev value: ', _objGraphicData.previousValue);
    console.log('got objGraphicData: ', _objGraphicData.currentValue);  
    if( _objGraphicData.currentValue!=undefined)
    {            
      this.randomize(this.lb,this.data);
    }        
  }



  ngOnInit() {
    this.barChartLabels= ['2006', '2007', '2008', '2009', '2010', '2011', '2012']
    this.barChartData=[
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    
  }


    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
      console.log(event, active);
    }
  
    public randomize(lb,datas): void {      
        this.barChartLabels=lb;
        this.barChartData=datas;
        console.log(this.barChartData,this.barChartLabels);
    }

}
