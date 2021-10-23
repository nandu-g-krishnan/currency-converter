import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Symbols } from 'src/Models/symbols';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  allCurrency='https://api.exchangerate.host/symbols';
  currency = 'https://api.exchangerate.host/latest';
  timeSeries = 'https://api.exchangerate.host/timeseries?start_date=';

  getConfig() {
    return this.http.get<Symbol>(this.allCurrency);
    //.map(response => response.json().items);;
  }

  getCurrenctCurrencyValue(code: any) {
    return this.http.get(this.currency+'?base='+code);
    //.map(response => response.json().items);;
  }

  getCurrenctTimeSeries(fromDate: any, toDate:any, code: any) {
    return this.http.get(`${this.timeSeries}${fromDate}&end_date=${toDate}`+'&base='+code);
    //.map(response => response.json().items);;
  }
}
