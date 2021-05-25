import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter(it => {
            return it.toString().toLowerCase().includes(searchText);
        });
    }
    
}

@Pipe({
    name: 'Lookupfilter'
})
export class LookupFilterPipe implements PipeTransform {
  
    transform(items: any[], field: string, field2: string, field3: string, value: string): any[] {
        if (!items) {
            return [];
        }
        if (!field || !field2 || !field3 || !value) {
            return items;
        }

        return items.filter(singleItem => singleItem[field].toLowerCase().includes(value.toLowerCase()) ||  singleItem[field2].toLowerCase().includes(value.toLowerCase())  ||  singleItem[field3].toLowerCase().includes(value.toLowerCase()) );
    }
       
    }

    @Pipe({
        name: 'Accesoryfilter'
    })
    export class AccesoryLookupFilterPipe implements PipeTransform {
      
        transform(items: any[], field: string, field2: string, value: string): any[] {
            if (!items) {
                return [];
            }
            if (!field || !field2  || !value) {
                return items;
            }
    
            return items.filter(singleItem => singleItem[field].toLowerCase().includes(value.toLowerCase()) ||  singleItem[field2].toLowerCase().includes(value.toLowerCase()));
        }
           
        }

