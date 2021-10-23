import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CurrencyService } from 'src/shared/currency.service';
import { ConverterComponent } from './converter/converter.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';



@NgModule({
  declarations: [
    AppComponent,
    ConverterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule.forRoot({
      messages: {
      emptyMessage: 'Data To Display',
      totalMessage: 'total',
      selectedMessage: 'selected'
      }
      }),
    HttpClientModule
  ],
  providers: [CurrencyService,DatePipe],
  bootstrap: [AppComponent]
 
})
export class AppModule { }
