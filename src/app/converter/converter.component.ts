import { Component, OnInit, VERSION, ViewChild } from '@angular/core';
import { CurrencyService } from 'src/shared/currency.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import 'lodash';
import { DatePipe } from '@angular/common';

declare var _:any;
export class CsvData {
    public name: any;
    public currency: any;
    public amount: any;
    public transactionDate: any;
    public convertedEURAmount: any;
    public convertedAmount: any;
    public convertedCode: any;
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {

  constructor(private currency: CurrencyService,public datepipe: DatePipe) { }
  symbol: Symbol;
  currencyList: any[] = [];
  selectedValue = 'Select';

  ngOnInit() {
    this.currency.getConfig().subscribe(data => {
      //  console.log(data['symbols']);
      //  console.log(JSON.stringify(data));
      let temp = data['symbols'];
      for (let key of Object.keys(temp)) {
        let tempValue = temp[key];
        // console.log(tempValue);
        let currencyObj = {
          description: tempValue.description,
          code: tempValue.code
        }
        this.currencyList.push(currencyObj);
      }
    });
  }

  selectCurrency(event: any) {
    this.currencyTo = event.code;
    this.selectedValue = this.currencyTo
    console.log(this.currencyTo);
  }
  public messageTable = {
    emptyMessage: 'No data to display',
    totalMessage: 'total',
    selectedMessage: 'selected'
  }
  convert() {
    this.loadingIndicator1 = true;
    this.currency.getCurrenctTimeSeries(this.fromDate,this.toDate,this.currencyValue).subscribe(data => {
      this.timeSeries = data['rates'];
      this.convertTableData(this.timeSeries,this.datesList);
    });
    this.loadingIndicator1 = false
  }
  
  convertTableData(timeSeries: any, datesList: any) {
    
    let currencyFiltered: any[] = [];
    let c=this.currencyTo
    currencyFiltered = _.pick(timeSeries, datesList);
    this.rows = _.forEach(this.records, function(value) {
      let date = value['transactionDate'];
      let v = _.pick(currencyFiltered, date);
      console.log(v[value['transactionDate']]['ANG']);
      value.convertedAmount = c != value.currency ? v[date][c] * value.convertedEURAmount : value.amount;
      value.convertedCurrency = c;
      // console.log(value);
    });
    console.log(this.rows);
  }
  name = 'Angular ' + VERSION.major;
  public records: any[] = [];
  rows : any[] = [];

  temp = [];
  ColumnMode = ColumnMode;
  loadingIndicator = false;
  loadingIndicator1 = false;
  reorderable = true;
  currencyValue: any;
  EURValue: any;
  currencyTo: any;
  fromDate: any;
  toDate: any;
  timeSeries: any;
  datesList: any[] = [];
  



  columns = [{ prop: 'Name' }, { name: 'Currency' }, { name: 'Amount' }, { name: 'TransactionDate' }];
  @ViewChild('csvReader',{static: true}) csvReader: any;
  @ViewChild('firstTable', {static: true}) myTable: DatatableComponent;
  jsondatadisplay:any;

  uploadListener($event: any): void {
    this.dataReset();
    this.loadingIndicator = true;
    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader: FileReader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData: string = reader.result.toString();
        let csvRecordsArray = (csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        console.log(headersRow);
        //this.columns = headersRow.slice( 0, 3);
        let recordData = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        // this.records.forEach(rowData => {
        //   this.rows.push(rowData);
        // });
        let formattedResults =  _.forEach(recordData, function(value) {
          value.transactionDate  = this.datepipe.transform(value['transactionDate'], 'yyyy-MM-dd')
        }.bind(this));
        let results  = _.sortBy(formattedResults, ['transactionDate']);
        this.records = results;
        let temp = [...results];
        let init = _.head(temp);
        //this.currencyValue = (init.currency);
        let toDate = temp[temp.length-1]['transactionDate'];
        this.toDate = this.datepipe.transform(toDate, 'yyyy-MM-dd');
        let fromDate = temp[0]['transactionDate'];
        this.fromDate = this.datepipe.transform(fromDate, 'yyyy-MM-dd');
        console.log(this.toDate,this.fromDate)
        console.log(this.currencyValue);
        // this.getCurrenctCurrencyValue(this.currencyValue);
        this.getDatesList(temp);
        this.convertToEuro();
        
      };

      reader.onerror = function () {
        
        console.log('error is occured while reading file!');
      };
      this.loadingIndicator = false;
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
    this.loadingIndicator = false
  }

  // getResultsInFormat() {
  //   this.rows = _.sortBy(this.records, ['transactionDate']);
  //   let  vg = _.forEach(rows, function(value) {
  //     let d = value['transactionDate'];
  //     value.transactionDate  = this.datepipe.transform(value['transactionDate'], 'yyyy-MM-dd')
      
  //   }.bind(this));
  // }


  getDatesList(rows: any) {
    let list: any[] = [];
    let  vg = _.forEach(rows, function(value) {
      let d = value['transactionDate'];
      let date = this.datepipe.transform(value['transactionDate'], 'yyyy-MM-dd')
      list.push(date);
    }.bind(this));
    this.datesList = list;
    
  }


  // getCurrenctCurrencyValue(CurrenctCurrencyValue) {
  //   this.currency.getCurrenctCurrencyValue(CurrenctCurrencyValue).subscribe(data => {
  //     this.EURValue = data['rates']['EUR'];
  //     console.log(this.EURValue);
  //     this.convertToEuro();
  //   });
    
  // }

  // convertToEuro() {
  //   let eur = this.EURValue;
  //   let  vg = _.forEach(this.records, function(value) {
  //     value.convertedEURAmount = value.amount * eur;
  //   });
  //   console.log(vg);
  // }

  convertToEuro() {
    let records :any[];
    this.currency.getCurrenctTimeSeries(this.fromDate,this.toDate,'EUR').subscribe(data => {
      let timeSeries = data['rates'];
      let currencyFiltered: any[] = [];
      let c:any =  data['base'];
      this.currencyValue = data['base'];
      let datesList = this.datesList;
      currencyFiltered = _.pick(timeSeries, datesList);
        this.records = _.forEach(this.records, function(value) {
        let date = value['transactionDate'];
        let v = _.pick(currencyFiltered, date);
        c = value['currency']
        value.convertedEURAmount =  value.amount * (1/(v[date][c]));
        value.convertedCurrency = c;
        console.log(value);
      });
    });
    return records;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];
    let data : CsvData[] = []; 
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord:  CsvData = new CsvData();
        csvRecord.name = curruntRecord[0].trim();
        csvRecord.currency = curruntRecord[1].trim();
        csvRecord.amount = curruntRecord[2].trim();
        csvRecord.transactionDate = curruntRecord[3].trim();
        csvRecord.convertedEURAmount = 0;
        csvArr.push(csvRecord);
      }
    }
    
    return csvArr;
  }

//check etension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
    this.rows = [];
    this.selectedValue = 'Select';
    this.dataReset();
  }

  dataReset() {
    this.records = [];
    this.rows = [];
    this.selectedValue = 'Select';
  }

  getJsonData(){
    this.jsondatadisplay = JSON.stringify(this.records);
    
  }
}
