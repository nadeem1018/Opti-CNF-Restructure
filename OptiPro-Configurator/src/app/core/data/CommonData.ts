import { HttpHeaders } from '@angular/common/http';


export interface ColumnSetting {
    field: string;
    title: string;
    format?: string;
    type: 'text' | 'numeric' | 'boolean' | 'date';
    width?: string;
    attrType: string;
}

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public imgPath = 'assets/images';
    public project_name: string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    public href: any = window.location.href;
    public application_path = this.get_current_url();
    public unauthorizedMessage = "The remote server returned an error: (401) Unauthorized.";
    public static sessionExpire: boolean = false;    
    public static made_changes: boolean = false;

    /* constructor(private router:Router,private toastr: ToastrService,private commonservice: CommonService) { } */

    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        let sanitized = temp.replace(/^http\:\/\//, '').replace(/\/+/g, '/').replace(/\/+$/, '');
        temp = (window.location.protocol + '//' + sanitized);

        return temp;
    }

    //defining properties for the call 
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        })
    }

    public lookup_selected_value = '';


    item_code_gen_string_dropdown(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return  [
        { "value": 1, "Name": language.string },
        { "value": 2, "Name": language.Number }
        ];
    }

    item_code_gen_oper_drpdown(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return  [
        { "value": 1, "Name": language.NoOperation },
        { "value": 2, "Name": language.Increase },
        { "value": 3, "Name": language.Decrease }
        ];
    }

    feature_bom_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": 1, "Name": language.feature },
        { "value": 2, "Name": language.item },
        { "value": 3, "Name": language.value }
        ];
    }
       option_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": 1, "Name": language.userDefine },
        { "value": 2, "Name": language.api },
        { "value": 3, "Name": language.function }
        ];
    }

    less_feature_bom_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": 2, "Name": language.item }
        ];
    }


    model_bom_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": 1, "Name": language.feature },
        { "value": 2, "Name": language.item },
        { "value": 3, "Name": language.model }
        ];
    }

    rule_seq_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": '', "Name": "" },
        { "value": 1, "Name": language.feature },
        { "value": 2, "Name": language.model }
        ];
    }

    operator_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
       return [
        { "value": '', "Name": "" },
        { "value": 'or', "Name": language.OR },
        { "value": 'and', "Name": language.AND }
        ];
    }

    yes_no_option(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": '', "Name": "" },
        { "value": 'n', "Name": language.NO },
        { "value": 'y', "Name": language.YES }
        ];
    }

    resource_consumption_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": '1', "Name": language.manual },
        { "value": '2', "Name": language.automatic },
        { "value": '3', "Name": language.operation_issue }
        ]
    }  

    resource_basic(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": '1', "Name": language.item },
        { "value": '2', "Name": language.batch },
        { "value": '3', "Name": language.fixed },
        { "value": '4', "Name": language.setup }
        ]
    }  

    public bracket_list = [
    { "value": '' },
    { "value": "[" },
    { "value": "{", },
    { "value": "(" },
    { "value": "]" },
    { "value": "}", },
    { "value": ")" },
    ];

    express_conditions(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": "=" },
        { "value": "<" },
        { "value": ">" },
        { "value": "<=" },
        { "value": ">=" },
        { "value": language.Between }
        ];
    }

    document_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
        { "value": 'draft', "Name": language.draft, "selected": "1" },
        { "value": 'sales_quote', "Name": language.SalesQuote, "selected": "0" },
        { "value": 'sales_order', "Name": language.SalesOrder, "selected": "0" }
        ];
    }

    time_uom_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
       return [
        { "value": 1, "Name": language.hours },
        { "value": 2, "Name": language.minute }
        ];
    }

    operation_type(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return {
            "1" : language.set_up,
            "2" : language.tear_down,
            "3" : language.manufacturing,
            "4" : language.inspection_qc,
            "5" : language.sub_contracting,
            "6" : language.others,
        } 
    }

    res_consumption_method(){
        let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return  {
            "1": language.set_up,
            "2": language.variable,
            "3": language.fixed,
        };
    }

 
    // for common view
    public default_limits = ["10", "25", "50", "100"];
    public default_count: number = 10;

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }

    checkSession() {
        let login_page = this.application_path + '/index.html#login';
        if (sessionStorage.getItem('isLoggedIn') == null) {
            window.location.href = login_page;
        }
    }

    random_string(length) {
        let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
    }
    public excludeSpecialCharRegex = /[{}*!^=<>?|/(\\)&#@%]/;


    public clearChildCheckbox(){
        let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if(child_checkbox_selector.length > 0){
          for(let i = 0; i < child_checkbox_selector.length; i++){
            child_checkbox_selector[i].checked = false;
          }
        }
      }
      public checkedChildCheckbox(){
        let child_checkbox_selector = document.getElementsByClassName("child_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if(child_checkbox_selector.length > 0){
          for(let i = 0; i < child_checkbox_selector.length; i++){
            child_checkbox_selector[i].checked = true;
          }
        }
      }
    
      
      
      public clearparentCheckbox(){
        let child_checkbox_selector = document.getElementsByClassName("parent_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if(child_checkbox_selector.length > 0){
          for(let i = 0; i < child_checkbox_selector.length; i++){
            child_checkbox_selector[i].checked = false;
          }
        }
      }    
      public checkedparentCheckbox(){
        let child_checkbox_selector = document.getElementsByClassName("parent_checkbox") as HTMLCollectionOf<HTMLInputElement>;
        if(child_checkbox_selector.length > 0){
          for(let i = 0; i < child_checkbox_selector.length; i++){
            child_checkbox_selector[i].checked = true;
          }
        }
      }
}
