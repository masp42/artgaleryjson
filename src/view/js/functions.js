        //base url without final bar  ---------------------------------- WITHOUT FINAL BAR
        var baseUrl = 'https://3000-e5420465-4bc3-4d88-95ea-583f4ec2f9a3.ws-us03.gitpod.io'; 
        var pathAPI = '/api/paintings';
        var APIUrl = baseUrl+pathAPI;

        var responseFromAPI = ''

        async function listAll() {
       
            // requisition of data contained in the link "APIUrl" using lib axios through the GET method
            await axios.get(APIUrl).then(response => {
                

                if(response.data === false || response.data.data.length == 0){
                    document.getElementById("tableListAll").innerHTML =  'No data found. Click in Insert data button to create register';
                }
                else{

                    let allData = response.data.data;  
                    let timestamp = new Date().getTime();
    
     
                    //Insert new fields, sort and remove others
                    for(let i=0; i < allData.length; i++){ 
    
                        allData[i].painting = `
                            <a href="`+baseUrl+'/'+allData[i].image+`?date=`+timestamp+`">
                                <img src="`+baseUrl+'/'+allData[i].image+`?date=`+timestamp+`" class="tableImage">
                            </a>
                        `
    
                        allData[i].name = allData[i].title
    
     
                        allData[i].actions = `
                            <a href="#updatePainting" class="btnUpdate" onclick="listOne(`+allData[i].painting_id+`)">Edit</a> - 
                            <a href="javascript:void(0);" onclick="deleteOne(`+allData[i].painting_id+`)">Delete</a>
                        `
                        //  removes the properties below from the object
                        delete allData[i].description; 
                        delete allData[i].artist; 
                        delete allData[i].painting_id; 
                        delete allData[i].title; 
                        delete allData[i].image; 
    
                    }
    
                    const listData = allData         
        
    
                    // EXTRACT VALUE FOR HTML TABLE HEADER. 
                    let col = [];
                    for (let i = 0; i < listData.length; i++) {
                        for (let key in listData[i]) {
                            if (col.indexOf(key) === -1) {
                                col.push(key);
                            }
                        }
                    }
    
                    // CREATE DYNAMIC TABLE.
                    let table = document.createElement("table");
                    table.classList.add('table');
                    table.classList.add('table-striped');
    
    
                    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    
                    
                    let tr = table.insertRow(-1);                   // TABLE ROW.
    
                    for (let i = 0; i < col.length; i++) {
                        let th = document.createElement("th");      // TABLE HEADER.
    
                        th.innerHTML = col[i];  
                        tr.appendChild(th);
                    }
    
                    // ADD JSON DATA TO THE TABLE AS ROWS.
                    for (let i = 0; i < listData.length; i++) {
    
                        tr = table.insertRow(-1);
    
                        for (let j = 0; j < col.length; j++) {
                            let tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = listData[i][col[j]];
                        }
                    }
    
    
                    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER
                    let divContainer = document.getElementById("tableListAll");
                    divContainer.innerHTML = "";
                    divContainer.appendChild(table);
    
                }

            }).catch(error => console.error(error));
 
        }



        async function listOne(id) {

            let timestamp = new Date().getTime();

            // requisition of data contained in the link "APIUrl+'/'+id" using lib axios through the GET method
            await axios.get(APIUrl+'/'+id)
            .then(response => {
                //change the values of inputs and image src to response data from API
                document.querySelector("#updatePaintingId").value = response.data.data[0].result.painting_id

                document.querySelector("#image_updateImage").src = baseUrl+'/'+response.data.data[0].result.image+'?date=`+timestamp+'

                document.querySelector("#updateTitle").value = response.data.data[0].result.title
                document.querySelector("#updateDescription").value = response.data.data[0].result.description
                document.querySelector("#updateArtistName").value = response.data.data[0].result.artist.name
                document.querySelector("#updateArtistCountry").value = response.data.data[0].result.artist.country
                document.querySelector("#updateArtistPeriod").value = response.data.data[0].result.artist.period


            }).catch(error => console.error(error));
            
        }





        async function create() {

    // receives data from a form and converts it to an object
            let data = new FormData()

            data.append('image', document.querySelector("#createImage").value);
            data.append('title', document.querySelector("#createTitle").value);
            data.append('description', document.querySelector("#createDescription").value);
            data.append('artist_name', document.querySelector("#createArtistName").value);
            data.append('artist_country', document.querySelector("#createArtistCountry").value);
            data.append('artist_period', document.querySelector("#createArtistPeriod").value);

            formData = data;
            // sending the data of the object generated by the values ​​of the form fields to the link "APIUrl" using 
            // lib axios through the POST method

           await axios.post(APIUrl, formData).then(response => {
                const createdData = response.data;

                let style = ''; 
    
                let messageFromAPI = 'Painting created sucessfully'
    
                if(createdData.message){

                    if(createdData.message == messageFromAPI){
                        style = "alert-success"

                        document.querySelector("#createForm").reset();
                        document.querySelector("#image_createImage").src = '';
                       
                        // reload function to show all data, including previusly inserted
                        listAll(); 

                    }
                    else{
                        style = "alert-warning"
                    }

                    responseFromAPI = createdData.message

                }
                else{
                    responseFromAPI = createdData.error
                    style = "alert-danger"
                }
     
                message = `<div class="alert `+style+` alert-dismissible fade show" role="alert">
                                `+responseFromAPI+`
                            </div>`
    
                //  return message from API response              
                document.querySelector("#createAlert").innerHTML = message;

                                
            }).catch(error => 'Error to insert data '+ error);

        }

        // prevents the form from being sent if the fields are empty
        $('#createForm').submit(function(event){
            event.preventDefault();
            create();
            collapseActions()
        });
       




        async function update() {

            let data = new FormData()

            id = document.querySelector("#updatePaintingId").value

            data.append('image', document.querySelector("#updateImage").value);
            data.append('title', document.querySelector("#updateTitle").value);
            data.append('description', document.querySelector("#updateDescription").value);
            data.append('artist_name', document.querySelector("#updateArtistName").value);
            data.append('artist_country', document.querySelector("#updateArtistCountry").value);
            data.append('artist_period', document.querySelector("#updateArtistPeriod").value);

            formData = data;

            // sending the data of the object generated by the values ​​of the form fields to the link 
            // "APIUrl + '/' + id" using lib axios through the PUT method
            await axios.put(APIUrl+'/'+id, formData).then(response => {
                const updatedData = response.data;

                let style = ''; 
    
                let messageFromAPI = 'Painting updated sucessfully'
    
                if(updatedData.message){

                    if(updatedData.message == messageFromAPI){
                        style = "alert-success"
                        listAll(); 
                        collapseActions()

                    }
                    else{
                        style = "alert-warning"
                    }

                    responseFromAPI = updatedData.message

                }
                else{
                    responseFromAPI = updatedData.error
                    style = "alert-error"
                }
     
                message = `<div class="alert `+style+` alert-dismissible fade show" role="alert">
                                `+responseFromAPI+`
                            </div>`
    
                document.querySelector("#updateAlert").innerHTML = message;

                                
            }).catch(error => 'Error to update data '+ error);

        }

        $('#updateForm').submit(function(event){
            event.preventDefault();
            update();
            collapseActions()
        });








        async function deleteOne(id) {

            // deletion of the data contained in the link "APIUrl + '/' + id" using lib axios 
            // through the DELETE method
            axios.get(APIUrl+'/'+id).then(response => {
  
                let title = response.data.data[0].result.title

                if(confirm('Do you really want to delete picture '+title+' ?')){
                    axios.delete(APIUrl+'/'+id).then(response2 => {
                        listAll(); 
                        collapseActions();
                    })
                    .catch(error2 => console.error(error2));
                }


            }).catch(error => console.error(error));


        }






        //JAVASCRIPT FUNCTION RESPONSIBLE FOR RESIZING IMAGES ON THE client SIDE
        function handleFiles(id){
            var dataurl = null;
            var filesToUpload = document.getElementsByClassName(id)[0].files;
            var file = filesToUpload[0];

            // Create an image
            var img = document.createElement("img");
            // Create a file reader
            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e)
            {
                img.src = e.target.result;

                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // CHANGE THE VALUE BELOW TO CHANGE THE MAXIMUM WIDTH OF THE GENERATED IMAGE
                    var MAX_WIDTH = 900;
                    // CHANGE THE VALUE BELOW TO CHANGE THE MAXIMUM HEIGHT OF THE GENERATED IMAGE
                    var MAX_HEIGHT = 900;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    dataurl = canvas.toDataURL("image/jpeg", 1.0);
                    document.getElementById('image_'+id).src = dataurl;  
                    document.getElementsByName(id)[0].value = dataurl;     
                
                } 
            }
            // Load files into file reader
            reader.readAsDataURL(file);
        }


        $("#collapseFormCreate").hide();
        $("#collapseFormUpdate").hide();
        collapseActions();

        // show and hide forms
        function collapseActions(){


            $(".btnCreate").on("click", function() {

                $("#collapseFormCreate").show(500);
                $("#collapseFormUpdate").hide();  
            });

            setTimeout(function(){

                $(".btnUpdate").on("click", function() {

                    $("#collapseFormUpdate").show(500);
                    $("#collapseFormCreate").hide();

                });

            }, 1000);

        }

        // Function responsible for displaying JSON data on the website
        async function listAllSite() {
       
            await axios.get(APIUrl).then(response => {
                

                let allData = response.data.data;  
                let timestamp = new Date().getTime();

                let listData = '';

                for(let i=0; i < allData.length; i++){ 

                    listData += `
                    <div class="col-lg-4 col-md-6 col-xs-6 thumb">
                        <a href="`+ allData[i].image+`" target="_blank" data-toggle="lightbox" data-gallery="gallery">
                            <img src="`+ allData[i].image+`" class="zoom img-fluid">
                        </a>
                        <p>Title: `+ allData[i].title+`</p>
                        <p>Arist: `+ allData[i].artist.name+`</p>
                        <p>Country: `+ allData[i].artist.country+`</p>
                        <p>Period: `+ allData[i].artist.period+`</p>
                        <p>Description: `+ allData[i].description+`</p> 
                    </div>
                    `
                }

                document.getElementById("listAll").innerHTML = listData;
                
            }).catch(error => console.error(error));
 
        }