importView = document.createElement("input")
importView.type = "file"
importView.accept = ".xlsx"
document.querySelector("#importView").addEventListener("click", function(){
    importView.click()
}) 

importCode = document.createElement("input")
importCode.type = "file"
importCode.accept = ".xlsx"
document.querySelector("#importCode").addEventListener("click", function(){
    importCode.click()
}) 


function newController(){
    return controller.start()
}
const controller ={
    dataView: [],
    dataCode: [],
    keyWords: [],
    keyFormat : [],
    dataResolve: [],
    customers: [],
    pendingViews: [],
    pendingCode: [],
    importView,
    keySearchView: "",
    keySearchCode:"",
    filterCode: false,
    currentPage:1,
    isformatCode : false,
    isRenderView : false,
    isformatView: false,
    pages: null,
    selectManager : '',
    start: function(){   
        importCode.addEventListener("change", function(e){
            e.targetPage = "code"
            controller.fileReader(e)
        })
        importView.addEventListener("change", function(e){
            e.targetPage = "view"
            controller.fileReader(e)
        })
        document.getElementById("next-page").addEventListener("click",function(){
            if(controller.currentPage==controller.pages) return
            controller.currentPage++
            controller.renderDataViewTwo()
        })
        document.getElementById("prev-page").addEventListener("click",function(){
            if(controller.currentPage==1) return
            controller.currentPage--
            controller.renderDataViewTwo()
        })
        btnFormatView.addEventListener("click",function(){
            if(controller.keyWords.length && controller.dataCode.length && controller.dataView.length && controller.pendingCode==0){
                if(!controller.isRenderView){
                    controller.renderDataView() 
                }else{
                    alert("ok")
                }
                controller.isRenderView = true 
                controller.isformatCode = true
            }else{
                if(controller.pendingCode>0){
                    alert("Chưa nhập hết các từ khóa")
                }
                alert("Chưa có dữ liệu về các từ khóa hoặc mặt hàng")
                return 
            }
            controller.renderDataSelectManager()
        })
        document.querySelector("#formatCode").addEventListener("click",function(){
            if(controller.dataCode.length){
                controller.renderDataCode()
                controller.isformatCode =true
            }else{
                alert("Các từ khóa tìm kiếm chưa được thêm vào hoặc chưa tải lên file mặt hàng")
                return
            }
        })
        btnAddKey.addEventListener("click", function(){
            controller.addKey()
            controller.isformatCode =true
        })
        keyName.addEventListener("keydown",function(e){
            if(e.keyCode ===13){
                controller.addKey()
                controller.isformatCode =true
            }
        })
        this.removeKey()
        document.querySelector("#table-code").addEventListener("click",function(e){
            if(e.target.closest("#filter-format")){             
                if(controller.dataCode.length){
                    controller.filterCode = controller.filterCode== false ? true : false    
                    controller.renderDataCode()     
                    if(controller.filterCode){
                        $("#filter-format").addClass("bg-filter")
                    } 
                   
                }
            }
        })
        document.querySelector("#search-view").addEventListener("keyup", function(e){
            keySearch = e.target.value.trim()
            controller.currentPage = 1
            controller.keySearchView = controller.xoa_dau(keySearch).toLowerCase()
            controller.renderDataViewTwo()  
        })
        document.querySelector("#search-code").addEventListener("keyup", function(e){
            keySearch = e.target.value.trim()
            controller.keySearchCode = controller.xoa_dau(keySearch).toLowerCase()
            controller.renderDataCode()
        })
        // document.getElementById("search-manage").addEventListener("keyup", function(e){
        //     keySearch = e.target.value.trim()
        //     controller.keySearchManager = controller.xoa_dau(keySearch).toLowerCase()
        //     controller.renderDataSelectManager()
        // })

        document.querySelector("#table-view").addEventListener("mouseover",function(e){
            if(e.target.closest("code")){
                let keyTarget = e.target.closest("code")
                let cartItem = keyTarget.firstChild.textContent
                let describeItem = keyTarget.firstElementChild
                let describe = controller.dataCode.find(e=>{
                    return e.nameFormat.replaceAll(" ","") == cartItem.replaceAll(" ","")
                })
                if(describe){
                    describe = describe.name
                    describeItem.innerHTML = `
                    <h3>Click to delete</h3>
                    <h4>Describe:</h4>
                    <p>${describe}</p>
                    `
                }else{
                    describeItem.innerHTML = `
                    <h3>Click to delete</h3>
                    <h4>Describe:</h4>
                    <p>No data</p>
                    `  
                }
               
                keyTarget.addEventListener("click",function(){
                    let UID = keyTarget.className
                    controller.customers = controller.customers.map(e=>{
                        if(e.UID == UID){
                            let index = e.cartFormat.indexOf(cartItem.replace(/  +/g," "))
                            e.cart.splice(index,1)
                            e.cartFormat.splice(index,1)
                            e.cartExport.splice(index,1)
                        }
                        return e
                        
                    })

                    controller.renderDataViewTwo()
                })
            }
        })

        $('#selectCode').on('select2:select', function (e) {
            controller.selectManager =  e.params.data.text
            controller.renderDataSelectManager()
        })
        
        

        overlay.addEventListener("click",function(e){
            if(e.target.closest("#closePending") || !e.target.closest("#overlayForm")){
                $("#overlay").hide()
            }
        });

        const event = document.querySelector("#table-pending").addEventListener("click", function (e) {
            if(e.target.closest("i")){
                removeKey = e.target.closest("i").id - ''
                controller.pendingViews.splice(removeKey,1)
                controller.renderDataPending()
                return 
            }
            AddToCart.innerHTML = ''
            $("#overlay").show()

            if(e.target.closest("td span")){
                let addCartTarget = e.target.closest("td span")
                let UID = addCartTarget.id.match(/\d+/)[0]

                ListTargetCus = controller.pendingViews.map(e=>{
                    return{
                        ...e,
                        cart : [...e.cart],
                        phone : [...e.phone]
                    }
                })

                let targetCus = controller.customers.find(e=>e.UID==UID)
                let isExist = true
                if(!targetCus){
                    targetCus = ListTargetCus.find(e=>e.UID==UID)
                    isExist = false
                } 
             
                let sCurentCart =''
                if(targetCus.cartFormat){
                    targetCus.cartFormat.forEach(e=>{
                        sCurentCart+= `<div class="keyString itemKey">${e}</div>`
                    })
                }                
               

                infoUID.innerHTML = `UID : <span>${targetCus.UID}</span> `
                infoName.innerHTML = `Name : <span>${targetCus.name}</span>`
                infoPhone.innerHTML = `Phone : <span>${targetCus.phone.join(" ")}</span>`
                curentCart.innerHTML = sCurentCart
                let selectOption = '<option value="Codes">Codes</option>'
                controller.dataCode.forEach(e=>{
                    selectOption += `<option value="${e.nameFormat}">${e.nameFormat}</option>`
                })
                addToCart.innerHTML = selectOption

                let arrAdd = new Set()

                $('#addToCart').on('select2:select',function(e) {
                    if(e.params.data.text=="Codes") return        
                    arrAdd.add(e.params.data.text)
                    arr = [...arrAdd]
                    let viewArrAdd =''
                    for(let i=0; i<arr.length; i++) {
                        viewArrAdd += `<div class="keyString itemKey" id="arr${i}">${arr[i]}</div>`
                    }
                              
                    AddToCart.innerHTML = viewArrAdd
                    let listBtn = document.querySelectorAll("#AddToCart .itemKey")

                    listBtn.forEach(e=>{
                        e.addEventListener("click",function(e){
                            let index = e.target.id.match(/\d+/)[0] - ''
                            arrAdd.delete(arr[index])
                            arr = [...arrAdd]
                            AddToCart.removeChild(e.target)
                        },{once: true})
                    })         
                });



                function add(){
                    let cartExport = []
                    arrAdd.forEach(e=>{
                        let itemCart = controller.dataCode.find(item=>item.nameFormat==e)
                        cartExport.push(itemCart.name)
                    })

                    if(isExist){   
                        controller.customers.forEach(el=>{     
                            if(el.UID==UID){     
                                el.cartFormat = [...el.cartFormat,...arrAdd]
                                el.cartExport = [...el.cartExport,...cartExport]
                                el.cartFormat = Array.from(new Set(el.cartFormat))
                                el.cartExport = Array.from(new Set(el.cartExport))
                            }
                        })  
                    }else{
                        if(!controller.customers.find(e=>e.UID==UID)) {
                            controller.customers.push({
                                ...targetCus,
                                cartFormat : [...arrAdd],
                                cartExport : [...cartExport]
                            })
                        }
                        isExist = true
                    }
                    controller.renderDataViewTwo() 
                    $("#overlay").hide()
                    document.querySelector("#btnAddToCart").removeEventListener("click",add)
                  
                }

                document.querySelector("#btnAddToCart").addEventListener("click",add,{ once: true })
                return

            }
        })

     

        
    },
    addKey(){
        if(this.dataCode.length==0){
            alert("Cần tải file lên trước")
            return 
        }
        let newKeyWord = {
            key: keyName.value,
            isNumber : isNumber.value == 0 ? false : true
        }
        addTrue = controller.keyWords.find(e=>e.key == newKeyWord.key)
        if(addTrue==undefined){
            controller.keyWords.push(newKeyWord)
            controller.keyWords =  controller.keyWords.filter(e=>e.key)
            controller.renderDataCode()
        }else{
          alert("Keyword đã tồn tại")
        }   
         
        let innerKeys =""
        for(let i=0; i<controller.keyWords.length; i++){
            let className = controller.keyWords[i].isNumber == true ? "keyNum" : "keyString"
            innerKeys += `<div class="${className} itemKey">${controller.keyWords[i].key}<i class="fa-solid fa-xmark"></i></div>`
        }
        keyWord.innerHTML = innerKeys
        keyName.value = ""
        controller.renderDataCode()
        
     
    },
    removeKey(){
        keyWord.addEventListener("click", function(e){
            keyTarget = e.target.closest("i")
            if(keyTarget){
                key = keyTarget.parentNode.firstChild.textContent
                controller.keyWords =  controller.keyWords.filter(e=>e.key != key)
                let innerKeys =""
                for(let i=0; i<controller.keyWords.length; i++){
                    let className = controller.keyWords[i].isNumber == true ? "keyNum" : "keyString"
                    innerKeys += `<div class="${className} itemKey">${controller.keyWords[i].key}<i class="fa-solid fa-xmark" id="d${i}"></i></div>`
                }
                keyWord.innerHTML = innerKeys

            }
        })
    }
    ,
    fileReader(oEvent) {
        let oFile = oEvent.target.files[0];
        let reader = new FileReader();
        reader.onload =function (e) {     
            let data = e.target.result;
            data = new Uint8Array(data);
            let workbook = XLSX.read(data, {type: 'array'});
            workbook.SheetNames.forEach(function (sheetName) {
                let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                if (roa.length && oEvent.targetPage == "view") {
                    controller.dataView=roa
                }else if(roa.length && oEvent.targetPage == "code") {
                    controller.dataCode = roa
                }
            });
        };
        reader.readAsArrayBuffer(oFile)
    },
    renderDataView(){
        $(".table-content").show()
        $(".overlay-content").hide()
        controller.formatArray()  
        dataView =  controller.customers    
        let table = document.querySelector("#table-view")
        mappTr = `  <tr>
                        <th class="th-id">ID</th>
                        <th class="th-uid">UID (${controller.customers.length})</th>
                        <th class="th-name">Name</th>
                        <th class="th-phone">Phone</th>
                        <th>Cart</th>
                    </tr>`
        for(let i=10*(this.currentPage-1);i<=10*(this.currentPage)-1;i++){
            let show = dataView[i].cartFormat.map(e=>{
                return `
                    <code class="${dataView[i].UID}">${e} <div class="describe ${dataView[i].UID}"></div> </code>
                `
            })
            mappTr+= `<tr>
                        <td>${i+1}</td>
                        <td>${dataView[i].UID}</td>
                        <td>${dataView[i].name}</td>
                        <td>${dataView[i].phone.join(`  `)}</td>
                        <td class="show-all">${show}</td>
                     </tr>`
        }
        table.innerHTML = mappTr
    },
    xoa_dau(str) {
        str = str.replace(/:|\.|\\|\/|,|:|;|\+/g," ")
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à̀|á|à̀|à/g, "a");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|à̀|á|à̀|à/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ó/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "i");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
        str = str.replace(/Đ/g, "d");
      
        return str;
    },
    formatKey(){
        controller.keyFormat = controller.keyWords
        for(let i = 0; i <this.keyWords.length; i++) {          
            if(this.keyFormat[i].isNumber){    
                let keyFormat =this.keyFormat[i].key.trim().split(" ").join(" *")     
                regExp = new RegExp(keyFormat+" *\\d+", "")
                this.dataView = this.dataView.map(obj => {
                    if(obj.formatView) {
                        return obj
                    }
                    let cartFormat = obj.cartFormat.match(regExp) !=null ? obj.cartFormat.match(regExp)[0]: obj.cartFormat
                    let formatView = obj.cartFormat.match(regExp) !=null ? true : false
                    return {
                        ...obj,
                        cartFormat: cartFormat.toLowerCase(),
                        formatView: formatView
                    }
                }) 
            }else{
                // *[\w|\W]* *
                let keyFormat =this.keyFormat[i].key.trim().split(" ").join(" *[a-z|A-Z]* *") 
                regExp = new RegExp(keyFormat, "")
                this.dataView = this.dataView.map(obj => {
                    if(obj.formatView) {
                        return obj
                    }
                    let cartFormat = obj.cartFormat.match(regExp) !=null ? this.keyFormat[i].key : obj.cartFormat    
                    let formatView = obj.cartFormat.match(regExp) !=null ? true : false
                    return {
                        ...obj,
                        cartFormat: cartFormat.toLowerCase(),
                        formatView: formatView
                    }
                }) 
            }
        }
        this.pendingViews = this.dataView.filter(e=>!e.formatView)
        this.formatPendingView()
        this.renderDataPending()
    },
    //Code tiep
    formatPendingView(){
        let ListUID = new Set()
        this.pendingViews.forEach(e=>{
            ListUID.add(e.UID)
        })
        ListUID = [...ListUID]
        ListUID= ListUID.map(e=>{
            return {
                UID: e,
                name:"",
                phone: new Set(),
                cart: new Set(),
                cartFormat:[]
            }
        })
        for (let index = 0; index < this.pendingViews.length; index++) {
            const element = this.pendingViews[index]
            for (let j=0;j<ListUID.length; j++) {
                if(ListUID[j].UID==element.UID) {
                    ListUID[j].name = element.name
                    ListUID[j].phone.add(element.phone)
                    ListUID[j].cart.add(element.cart)
                }
                ListUID[j].phone.delete('')
            }
            
        }
        this.pendingViews = ListUID


        this.pendingViews = this.pendingViews.filter(e=>{
            let item = controller.customers.find(i=>i.UID==e.UID)
            if(item || e.phone.size) {
                return true
            }else{
                return false
            }
        })
    }
    ,
    formatArray(){ 
        this.dataView = this.dataView.map((e)=>{
            e=e.filter((item)=> item!=undefined)
            return {
                UID : e[2],
                name : e[1],
                phone : e[3],
                cart : e[0],
                cartFormat : controller.xoa_dau(e[0]).toLowerCase()
            }
        })
        this.formatKey()
        if(!controller.currentPage.length){   
            this.customers = this.dataView.map(obj =>obj.UID)
            this.customers = Array.from(new Set(this.customers))
            this.customers = this.customers.map(customer =>{
                return {
                    UID: customer,
                    name : "",
                    phone : [],
                    cart : [],
                    cartFormat : [],
                }
            })
            for(let i=0; i<this.customers.length; i++){
               
                let cartCustomer = this.dataView.filter(e=>e.UID == this.customers[i].UID && e.formatView);
                let phone  = new Set()
                let cart = new Set()
                let cartFormat = new Set()

                for (let j = 0; j <cartCustomer.length; j++) {
                    let UID
                    let name
                    UID = cartCustomer[j].UID
                    name = cartCustomer[j].name   
                    phone.add(cartCustomer[j].phone)
                    cart.add(cartCustomer[j].cart)
                    cartFormat.add(cartCustomer[j].cartFormat)
                    if(j==cartCustomer.length-1){
                        this.customers[i] = {
                            UID : UID,
                            name : name,
                            phone : [...phone],
                            cart : [...cart],
                            cartFormat: [...cartFormat],
                            cartExport : []
                        }
                    }
                }
                for(let i = 0; i <this.customers.length; i++) {
                    this.customers[i].cartExport = this.customers[i].cartFormat.map(e=>{
                        let cart = this.dataCode.filter(item=>item.nameFormat==e)
                        return cart[0]
                    })
                    this.customers[i].cartExport = this.customers[i].cartExport.map(e=>{
                        if(e  == undefined){
                            return 
                        }
                        return e.name  
                    })

                }
               
               
            }
               
            this.customers = this.customers.filter(e=>{
                e.phone = e.phone.filter(i=>i.length>0)
                return e.cartFormat.length>0 && e.phone.length>0
            }) 
        }
        return this.dataView
    },
    renderDataCode(){
        this.formatCode()
        tableCode = document.querySelector("#table-code")
        let dataCode
        if(controller.filterCode){
            dataCode = controller.dataCode.filter(e=>!e.formatCode)
        }else{
            dataCode = controller.dataCode
        }
        if(this.keySearchCode){
            
            dataCode = dataCode.filter(e=>{
                let name = controller.xoa_dau(e.name).toLowerCase()
                let nameFormat = controller.xoa_dau(e.nameFormat).toLowerCase()
                let price = controller.xoa_dau(e.price+'k').toLowerCase()
                let formatCode = controller.xoa_dau(e.formatCode + '').toLowerCase()
                let limit =controller.xoa_dau(e.limit + '').toLowerCase()
                return name.match(controller.keySearchCode) ||
                       nameFormat.match(controller.keySearchCode) ||
                       price.match(controller.keySearchCode) ||
                       formatCode.match(controller.keySearchCode) ||
                       limit.match(controller.keySearchCode) 

            })
        }
        let mapTr = `<tr>
                        <th class="th-id">ID</th>
                        <th class="th-product">Product</th>
                        <th class="th-code">Code (${dataCode.length})</th>
                        <th class="th-price">Price</th>
                        <th class="th-fromat">Fromat <i class="fa-solid fa-filter" id="filter-format"></i> </th>
                        <th class="th-limit d-none">Limit</th>
                    </tr>`
      
        for(let i = 0; i <dataCode.length; i++){ 
            mapTr+=`<tr>
                        <td> ${i+1} </td>
                        <td> ${dataCode[i].name} </td>
                        <td>  ${dataCode[i].nameFormat} </td>
                        <td> ${dataCode[i].price}k </td>
                        <td> ${dataCode[i].formatCode || false} </td>
                        <td class="d-none"> ${dataCode[i].limit || false} </td>
                    </tr>`
        }
        tableCode.innerHTML = mapTr
        
    }
    ,
    formatCode(){
        if(this.isformatCode && this.dataCode.length){
            this.dataCode = this.dataCode.map(e=>{    
                if(e===undefined) return e
                let price = e.name.match(/( *\d+ *k)/) !=null ? e.name.toLowerCase().match(/( *\d+ *k)/)[0] : 0
                price = price!=0 ? price.match(/\d+/)[0] - "0" : 0
                return{
                    ...e,
                    price:  price,
                }
            })
            controller.keyFormat = controller.keyWords
            for(let i = 0; i <this.keyWords.length; i++) {     
            let keyFormat =this.keyFormat[i].key.trim().replace(/  +/g," ")
                if(this.keyFormat[i].isNumber){   
                    regExp = new RegExp(keyFormat+" *\\d+", "")
                    this.dataCode = this.dataCode.map(obj => {
                        if(obj.formatCode){
                            return obj
                        }
                        let nameFormat = obj.nameFormat.match(regExp) !=null ? obj.nameFormat.match(regExp)[0]: obj.nameFormat
                        let formatCode = obj.nameFormat.match(regExp) !=null ? true : false
                        return {
                            ...obj,
                            nameFormat: nameFormat.toLowerCase(),
                            formatCode: formatCode,
                            limit: false
                        }
                    }) 
                }else{
                    let keyFormat =this.keyFormat[i].key.trim().replace(/  +/g," ")
                    regExp = new RegExp(keyFormat, "")
                    this.dataCode = this.dataCode.map(obj => {
                        if(obj.formatCode){
                            return obj
                        }
                        let nameFormat = obj.nameFormat.match(regExp) !=null ? obj.nameFormat.match(regExp)[0].replace(/  +/g," "): obj.nameFormat
                        let formatCode = obj.nameFormat.match(regExp) !=null ? true : false
                        return {
                            ...obj,
                            nameFormat: nameFormat.toLowerCase(),
                            formatCode: formatCode,
                            limit: false
                        }
                       
                    }) 
                }
            }
            this.pendingCode = this.dataCode.filter(e=>!e.formatCode)
            controller.renderDataSelectManager()
            return 
        }
    ////////////////////////////////
        this.dataCode = this.dataCode.filter(e=>e.length>0)
        this.dataCode = this.dataCode.map(e=>{
            e=e.filter((item)=> item!=undefined)           
            return{
                name : e[0],
                nameFormat : this.xoa_dau(e[0]).toLowerCase(),
                price : 0,
                formatCode: false,
            }
        })
       
        controller.keyFormat = controller.keyWords
        for(let i = 0; i <this.keyWords.length; i++) {     
            let keyFormat =this.keyFormat[i].key.trim().replace(/  +/g," ")
            if(this.keyFormat[i].isNumber){   
                regExp = new RegExp(keyFormat+" *\\d+", "")
                this.dataCode = this.dataCode.map(obj => {
                    let nameFormat = obj.nameFormat.match(regExp) !=null ? obj.nameFormat.match(regExp)[0].replace(/  +/g," "): obj.nameFormat
                    let formatCode = obj.nameFormat.match(regExp) !=null ? true : false
                    return {
                        ...obj,
                        nameFormat: nameFormat.toLowerCase(),
                        formatCode: formatCode,
                        limit: false
                    }
                }) 
            }else{
                keyFormat =keyFormat.splice(" ").join(" *")
                regExp = new RegExp(keyFormat, "")
                this.dataCode = this.dataCode.map(obj => {
                    let nameFormat = obj.nameFormat.match(regExp) !=null ? obj.nameFormat.match(regExp)[0].replace(/  +/g," "): obj.nameFormat
                    let formatCode = obj.nameFormat.match(regExp) !=null ? true : false
                    return {
                        ...obj,
                        nameFormat: nameFormat.toLowerCase(),
                        formatCode: formatCode,
                        limit: false
                    }
                }) 
            }
        }
        this.dataCode = this.dataCode.map(e=>{
            let price = e.name.match(/( *\d+ *k)/) !=null ? e.name.match(/( *\d+ *k)/)[0] : 0
            price = price!=0 ? price.match(/\d+/)[0] - "0" : 0
            return{
                ...e,
                price:  price
            }
        })

        this.pendingCode = this.dataCode.filter(e=>!e.formatCode)
        
    },
    renderDataSelectManager(){
        
           let options = ''
           for (let i=0; i<controller.dataCode.length; i++){
               if(controller.dataCode[i].formatCode){
                 options+= `<option value="${controller.dataCode[i].nameFormat}">${controller.dataCode[i].nameFormat}</option>\n`
               } 
           }
           selectCode.innerHTML = options
           selectCode.value = controller.selectManager
           
           let textM = controller.dataCode.find(e=>e.nameFormat==controller.selectManager)
           if(textM){
               let elTextM =document.querySelector(".mDescribe")
               elTextM.innerHTML = `<p class="mDescribe"> <span> Describe:</span> ${textM.name} </p>`
           }
        
           if(controller.customers.length){
                let dataManager = controller.customers.filter(e=>{
                    let arr = e.cartFormat.find(e=>e==controller.selectManager)    
                    return  arr
                })
                if(this.keySearchManager){
                    dataManager = dataManager.filter(e=>{
                        let name = controller.xoa_dau(e.name).toLowerCase().replace(/  +/g," ")
                        let UID = controller.xoa_dau(e.UID+'k').toLowerCase().replace(/  +/g," ")
                        let phone = controller.xoa_dau(e.phone.join(' ')).toLowerCase().replace(/  +/g," ")
                        return name.match(controller.keySearchManager) ||
                               UID.match(controller.keySearchManager) ||
                               phone.match(controller.keySearchManager) 
                    })
                }
                dataManager=dataManager.map(e=> {
                    return {
                        ...e,
                        check : true
                    }
                })
              
                if(dataManager.length){
                    let table = document.querySelector("#table-manage")
                    let tableManager =`
                                <tr>
                                    <th class="mID">ID</th>
                                    <th>UID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th class="mKeep">All <input class="form-check-input" type="checkbox" id="selectAll" checked> </th>
                                </tr>`
                    for(let i = 0; i <dataManager.length; i++) {
                        tableManager+=`
                        <tr>
                            <td>${i}</td>
                            <td>${dataManager[i].UID}</td>
                            <td>${dataManager[i].name}</td>
                            <td>${dataManager[i].phone.join(" ")}</td>
                            <td> <input class="form-check-input itemCus" type="checkbox" id="m${i}" checked></td>
                        </tr>` 
                    }
                    table.innerHTML = tableManager
                    let listInput = document.querySelectorAll(".itemCus")
                    selectAll.addEventListener("click", function(){
                        if(dataManager.length > 0){
                            let isTrue = selectAll.checked
                            listInput.forEach(e=>{
                                e.checked = isTrue
                                dataManager.forEach(e=>{
                                    e.check = isTrue
                                })
                            })
                        }
       
                    })
                    listInput.forEach(e=>{
                        e.addEventListener("change",function(e){
                            index = e.target.id.match(/\d+/)[0]-''
                            dataManager[index].check = e.target.checked
                        })
                    })   
                    keepManagement.addEventListener("click", function(){
                        let removeDtata=dataManager.filter(e=>e.check == false)
                        dataManager = dataManager.filter(e=>e.check)
                        controller.customers.forEach(e=>{
                            removeDtata.forEach(i=>{
                                if(e.UID==i.UID){
                                    let index = e.cartFormat.indexOf(controller.selectManager)
                                    e.cart.splice(index,1)
                                    e.cartFormat.splice(index,1)
                                    e.cartExport.splice(index,1)       
                                    let table = document.querySelector("#table-manage")
                                    let tableManager =`
                                                <tr>
                                                    <th class="mID">ID</th>
                                                    <th>UID</th>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th class="mKeep">All <input class="form-check-input" type="checkbox" id="selectAll" checked> </th>
                                                </tr>`
                                    for(let i = 0; i <dataManager.length; i++) {
                                        tableManager+=`
                                        <tr>
                                            <td>${i}</td>
                                            <td>${dataManager[i].UID}</td>
                                            <td>${dataManager[i].name}</td>
                                            <td>${dataManager[i].phone.join(" ")}</td>
                                            <td> <input class="form-check-input itemCus" type="checkbox" id="m${i}" checked></td>
                                        </tr>` 
                                    }
                                    table.innerHTML = tableManager
                                    controller.renderDataViewTwo()
                                }
                            })
                        })
                    })
                }else{
                    let table = document.querySelector("#table-manage")
                    let tableManager =`
                                <tr>
                                    <th class="mID">ID</th>
                                    <th>UID</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th class="mKeep">All <input class="form-check-input" type="checkbox" id="selectAll" checked> </th>
                                </tr>`
                    table.innerHTML = tableManager         
                }
              
           }
    }
    ,
    renderDataViewTwo(){

        this.customers = this.customers.filter(e=>e.cartFormat.length)
        let dataView = this.customers.filter(e=> {
            let UID = e.UID
            let name = this.xoa_dau(e.name).toLowerCase()
            let phone = this.xoa_dau(e.phone.join(' ')).toLowerCase()
            let cartFormat = this.xoa_dau(e.cartFormat.join(' ')).toLowerCase()
            return UID.match(this.keySearchView) ||
                   name.match(this.keySearchView) ||
                   phone.match(this.keySearchView)||
                   cartFormat.match(this.keySearchView)
        })  

        if(dataView.length%10==0){
            this.pages = dataView.length/10
        }else{
            this.pages = (dataView.length - dataView.length%10) / 10 + 1
        }
        
        document.querySelector(".curent-page").innerHTML = this.currentPage + "/" + this.pages
        
        let table = document.querySelector("#table-view")
        mappTr = `  <tr>
                        <th class="th-id">ID</th>
                        <th class="th-uid">UID (${dataView.length})</th>
                        <th class="th-name">Name</th>
                        <th class="th-phone">Phone</th>
                        <th>Cart</th>
                    </tr>`
        for(let i=10*(this.currentPage-1);i<10*(this.currentPage);i++){
            if (dataView[i]==undefined) {
                break
            } 
            let show = dataView[i].cartFormat.map(e=>{
                return `
                    <code class="${dataView[i].UID}" >${e.replace(/  +/g," ")}  <div class="describe ${dataView[i].UID}"></div></code>
                `
            })
            mappTr+= `<tr>
                        <td>${i+1}</td>
                        <td>${dataView[i].UID}</td>
                        <td>${dataView[i].name}</td>
                        <td>${dataView[i].phone.join(' ')}</td>
                        <td class="show-all">${show.join()}</td>
                     </tr>`
        }
        table.innerHTML = mappTr
        
    },
    renderDataPending(){
        if(this.pendingViews==undefined){
            alert("No Data")
        }else{
            let tablePending = document.getElementById("table-pending")

            let mapTr = `
            <tr>
                <th class="th-id">ID</th>
                <th class="th-uid">UID (${this.pendingViews.length})</th>
                <th class="th-name">Name</th>
                <th class="th-phone">Phone</th>
                <th class="th-message">Message</th>
            </tr>`
            for(let i=0; i<this.pendingViews.length; i++){
                mapTr +=  `<tr>
                            <td>${i+1}</td>
                            <td>${this.pendingViews[i].UID}</td>
                            <td>${this.pendingViews[i].name}</td>
                            <td>${[...this.pendingViews[i].phone].join("</br>")}</td>
                            <td class="show-all">${[...this.pendingViews[i].cart].join("</br>")}
                            <i class="fa-solid fa-trash-can" id="${i}"></i>
                            <span class="fa-solid fa-cart-plus" id="add${this.pendingViews[i].UID}">
                                <div class="addCartCustomer add${this.pendingViews[i].UID}">
                                </div>
                            </span>
                            </td>
                            
                            </tr>`
            }
            tablePending.innerHTML = mapTr
            
    
        }     
    },
    ExportView(type, fn, dl) {
        if(this.dataView.length==0){
            alert("Chưa có dữ liệu để xuất")
            return
        }
        let elt = document.createElement('table')
        let dataExportView = `
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Cart</th>
        </tr>`
        for (let i = 0; i < controller.customers.length; i++) {
            let name = this.customers[i].name
            let phone = this.customers[i].phone
            let cartExport = this.customers[i].cartExport
            dataExportView += `
            <tr>
                <td>${name}</td>
                <td>${phone.join("  ")}</td>
                <td>${cartExport.join(" + ")}</td>
            </tr>
            `
        }
        elt.innerHTML = dataExportView

        let wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
        return dl ?
            XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
            XLSX.writeFile(wb, fn || ('Dữ Liệu Khách Hàng.' + (type || 'xlsx')));
    },
    ExportPending(type, fn, dl) {
        if(this.pendingViews.length==0){
            alert("Chưa có dữ liệu để xuất")
            return
        }
        let elt = document.getElementById('table-pending');
        let wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
        return dl ?
            XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
            XLSX.writeFile(wb, fn || ('Chưa xử lý.' + (type || 'xlsx')));
    },
    ExportManager(type, fn, dl){
        if(this.dataView.length==0) {
            alert('Chưa có dữ liệu ')
            return
        }
        let dataManager = controller.dataView.filter(e=>e.formatView)
        let elTable = document.createElement('table');
        let tableManager = `
        <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Cart</th>
        </tr>`
        for (let i = 0; i <dataManager.length; i++){
            tableManager += `
            <tr>
                <td>${dataManager[i].name}</td>
                <td>${dataManager[i].phone}</td>
                <td>${dataManager[i].cart}</td>
            </tr>`
        }
        elTable.innerHTML = tableManager
        let wb = XLSX.utils.table_to_book(elTable, {sheet:"Sheet JS"});
        return dl ?
            XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
            XLSX.writeFile(wb, fn || ('Dữ Liệu Tổng.' + (type || 'xlsx')));   
    }
}
controller.start()