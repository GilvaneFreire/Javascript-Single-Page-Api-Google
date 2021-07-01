
var markersDataVeiculo = []
var markersDataEntrega = []
var tiposVeiculo = []
var statusVeiculo = []
//CARREGA AS POSIÇÕES DE TODOS OS VEÍCULOS
function carregaPosicoesVeiculos(){
    var request = new XMLHttpRequest();
    request.open("GET", "http://logan.coopercargo.net:5000/Truck/Veiculos", true);
  
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const data = JSON.parse(this.response);
        data.forEach(veiculo => {
            markersDataVeiculo.push(veiculo);
            });
        };
        
    };
    
    request.send();

};
//CARREGA POSIÇÕES DOS VEÍCULOS BASEADO NA PREVISÃO DE ENTREGA
function carregaPosicoesPrevEntrega(){
    var request = new XMLHttpRequest();

    request.open('GET', 'http://logan.coopercargo.net:5000/Truck/DataEntrega');

    request.onload = function() {
        const data = JSON.parse(this.response);

        data.forEach(veiculo => {
            markersDataEntrega.push(veiculo);
        });
    };
    request.send();
};
//CARREGA OS TIPOS DE VEÍCULO PARA O FILTRO
function carregaTipoVeiculo(){
    var rqt = new XMLHttpRequest();

    rqt.open('GET', 'http://logan.coopercargo.net:5000/Truck/TipoVeiculos');

    rqt.onload = function() {
        const data = JSON.parse(this.response);

        data.forEach(veiculo => {
            tiposVeiculo.push(veiculo);
        });
    };
    rqt.send();
};
//FUNÇÃO QUE USA OS DADOS SELECIONADOS E CRIA O CAMPO DE FILTRO POR TIPO DE VEÍCULO
function carregaCheckbox(markersData){
    var array = markersData;

    function array_unique(array){
        var unique = [];
        for(var i in array){
            if(unique.indexOf(array[i].tipoVeiculo)==-1){
                unique.push(array[i].tipoVeiculo);
            };
        };
        
        return unique;
    };
    
    function array_unique_status(array){
        var unique_status = [];
        for(var i in array){

            var days = array[i].diasSemAtualizar;
             
            if (days >= 5){
                if(unique_status.indexOf("Sem Atualização")==-1){
                    unique_status.push("Sem Atualização");
                };
            }else if(unique_status.indexOf(array[i].status)==-1){
                unique_status.push(array[i].status);
            };
        };
        return unique_status;
    };

    var tiposExistentesNoMapa = array_unique(array);

    var lista = document.getElementById('divApagar');
    var div = document.createElement('div');
    div.setAttribute('class', 'form-check');
    var input = document.createElement('input');
    input.setAttribute('class', 'form-check-input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', 'itemCheck');
    input.setAttribute('checked', true);
    input.setAttribute('onclick', 'limpaCheck()')
    var label = document.createElement('label');
    label.setAttribute('class', 'form-check-label');
    label.innerHTML = 'Limpar todos os checkbox';
    div.appendChild(input);
    div.appendChild(label);
    
    lista.appendChild(div);
    
    for (let i = 0; i < tiposExistentesNoMapa.length; i++) {
        var tipo = tiposExistentesNoMapa[i];
        var pos = tiposVeiculo.find( busca => (busca.codigo === tipo));
        var lista = document.getElementById('divApagar');
        var div = document.createElement('div');
        div.setAttribute('class', 'form-check');
        var input = document.createElement('input');
        input.setAttribute('class', 'form-check-input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('name', 'itemCheck');
        input.setAttribute('checked', true);
        input.setAttribute('id', pos.codigo);
        var label = document.createElement('label');
        label.setAttribute('class', 'form-check-label');
        label.setAttribute('for', pos.codigo);
        label.innerHTML = pos.descricao;
        div.appendChild(input);
        div.appendChild(label);
        
        lista.appendChild(div);
    };

    var statusExistentesNoMapa = array_unique_status(array);    
    
    for (let i = 0; i < statusExistentesNoMapa.length; i++) {
        var statusParaCheckbox = statusExistentesNoMapa[i];

        if(statusParaCheckbox == 'Sem Atualização'){
            var lista = document.getElementById('divApagarStatusAtualizacao');
            var div = document.createElement('div');
            div.setAttribute('class', 'form-check');
            var input = document.createElement('input');
            input.setAttribute('class', 'form-check-input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', 'itemCheckStatus');
            input.setAttribute('checked', true);
            input.setAttribute('id', 'NSemAtt');
            var label = document.createElement('label');
            label.setAttribute('class', 'form-check-label');
            label.setAttribute('for', 'NSemAtt');
            label.innerHTML = statusParaCheckbox;
            div.appendChild(input);
            div.appendChild(label);
            
            lista.appendChild(div);

            var lista = document.getElementById('divApagarStatusAtualizacao');
            var div = document.createElement('div');
            div.setAttribute('class', 'form-check');
            var input = document.createElement('input');
            input.setAttribute('class', 'form-check-input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', 'itemCheckStatus');
            input.setAttribute('checked', true);
            input.setAttribute('id', 'ComAtt');
            var label = document.createElement('label');
            label.setAttribute('class', 'form-check-label');
            label.setAttribute('for', 'ComAtt');
            label.innerHTML = 'Com Atualização';
            div.appendChild(input);
            div.appendChild(label);
            
            lista.appendChild(div);
        }else{
            var lista = document.getElementById('divApagarStatus');
            var div = document.createElement('div');
            div.setAttribute('class', 'form-check');
            var input = document.createElement('input');
            input.setAttribute('class', 'form-check-input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('name', 'itemCheckStatus');
            input.setAttribute('checked', true);
            input.setAttribute('id', statusParaCheckbox);
            var label = document.createElement('label');
            label.setAttribute('class', 'form-check-label');
            label.setAttribute('for', statusParaCheckbox);
            label.innerHTML = statusParaCheckbox;
            div.appendChild(input);
            div.appendChild(label);
            
            lista.appendChild(div);
        }
    };

};
//FUNÇÃO QUE LIMPA O FILTRO TODA VEZ QUE UMA NOVA PESQUISA É FEITA, PARA NÃO DUPLICAR OS CAMPOS.
function limpaCheckbox(){
    var lista = document.getElementById('divApagar');
    lista.remove();
    var divLimpa = document.getElementById('filtroDosVeiculos');
    var div = document.createElement('div');
    div.setAttribute('id', 'divApagar');
    divLimpa.appendChild(div);

    var lista = document.getElementById('divApagarStatus');
    lista.remove();
    var divLimpa = document.getElementById('filtroDosStatus');
    var div = document.createElement('div');
    div.setAttribute('id', 'divApagarStatus');
    divLimpa.appendChild(div);

    var lista = document.getElementById('divApagarStatusAtualizacao');
    lista.remove();
    var divLimpa = document.getElementById('filtroDosStatusAtualizacao');
    var div = document.createElement('div');
    div.setAttribute('id', 'divApagarStatusAtualizacao');
    divLimpa.appendChild(div);
};

//ABAIXO DUAS FUNÇÕES QUE LIMPAM O CAMPO DIGITADO AO CLICAR NO ÍCONE DO CAMPO DIGITADO
//UTILIZADAS NO CAMPO DE BUSCA LOCALIDADE E PLACA/COOPERADO
function limpa() {
    if(document.getElementById('pac-input').value!="") {
        document.getElementById('pac-input').value="";
    };
};
function limpaPlaca() {
    if(document.getElementById('pac-input-placa').value!="") {
        document.getElementById('pac-input-placa').value="";
        window.location.reload();
        console.log('apagou e resetou');
        
    };
    
};
