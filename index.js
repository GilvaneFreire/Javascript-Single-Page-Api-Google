function initMap() {
  //CARREGA DADOS DA API PARA EXIBIR NO MAPA E SERVIR COMO 
  //PESQUISA NO CASO DE PREVISÃO DE ENTREGA E TIPO DO VEÍCULO
  
  carregaPosicoesVeiculos();
  carregaPosicoesPrevEntrega();
  carregaTipoVeiculo();

  //CAMPO DE PESQUISA PELO NOME DO COOPERADO OU PLACA DO VEÍCULO (NÃO FAZ A BUSCA PELA PLACA DO CAVALO)
  var input = document.getElementById("pac-input-placa");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      filtrar(markersData);
    };
  });
  
  	function initialize() {

    infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'click', function () {
      infoWindow.close();
      document.getElementById("dadosVeiculo").style.display = "none";
      document.getElementById("check").checked = false;
    });
    setTimeout(() => {
      carregaCheckbox(markersData);
      mostraMarcadoresNoMapa(markersData);
    }, 1000);
  	}
	google.maps.event.addDomListener(window, 'load', initialize);
	var markersData = [];
	markersData = markersDataVeiculo;
	}
  /////////
	


//Esta função carrega os marcadores na tela
function mostraMarcadoresNoMapa(markersData){
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -16.4234978, lng: -56.7942581 },
    zoom: 4,
    mapTypeControl: false,
  });
  //TRECHO DO CÓDIGO ONDE O CAMPO DE BUSCA POR CIDADE COM
  //AUTOCOMPLETAR É CRIADO E UTILIZADO.
  var input = document.getElementById("pac-input");
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  autocomplete.setFields(["address_components", "geometry", "icon", "name"]);
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });
 
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();

    if (!place.geometry) {
      window.alert("Nenhum dado encontrado para: '" + place.name + "', Digite o local desejado e clique no local localizado pelo autocompletar");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(16);
    };
    marker.setPosition(place.geometry.location);
    marker.setVisible(false);

  });

  const markersRange = []
  displayMarcadoresData(markersData);

  function displayMarcadoresData(markersData) {

    var bounds = new google.maps.LatLngBounds();

    // Loop que vai percorrer a informação contida em markersData 
    // para que a função createMarker possa criar os marcadores 
    for (var i = 0; i < markersData.length; i++) {
      var idVeiculo = markersData[i].idVeiculo;
      var placa = markersData[i].placa;
      var dataPacote = markersData[i].dataPacote;
      var status = markersData[i].status;
      var cltLatMarker = markersData[i].cltlat;
      var cltLngMarker = markersData[i].cltlng;
      var cooperado = markersData[i].cooperado;
      var motorista = markersData[i].motorista;
      var viagem = markersData[i].viagem;
      var cliente = markersData[i].cliente;
      var destinatario = markersData[i].destinatario;
      var destino = markersData[i].destino;
      var prevEntrega = (markersData[i].prevEntrega).substr(0, 10);
      var placaCavalo = markersData[i].placaCavalo;
      var tipoVeiculo = markersData[i].tipoVeiculo;
      var latlng = new google.maps.LatLng(cltLatMarker, cltLngMarker);

      createMarkerRange(latlng, idVeiculo, placa, dataPacote, status,
        cooperado, motorista, viagem, cliente, destinatario, destino, 
		prevEntrega, placaCavalo, tipoVeiculo, cltLatMarker, cltLngMarker);

    // Os valores de latitude e longitude do marcador são adicionados à
    // variável bounds
    bounds.extend(latlng); 
    };

    // Depois de criados todos os marcadores,
    // a API GOOGLE MAPS, através da sua função fitBounds, vai redefinir o nível do zoom
    // e consequentemente a área do mapa abrangida de acordo com
    // as posições dos marcadores
    map.fitBounds(bounds);  
  };

  // Função que cria os marcadores e define o conteúdo de cada Info Window.
  function createMarkerRange(latlng, idVeiculo, placa, dataPacote, status,
    cooperado, motorista, viagem, cliente, destinatario, destino, 
	prevEntrega, placaCavalo, tipoVeiculo, cltLatMarker, cltLngMarker) {
    
    //VARIÁVEL CRIADA PARA TRATAR QUANDO MAIS DE UM MARCADOR ESTIVER
    //EXATAMENTE NA MESMA POSIÇÃO (OCORRE MUITO QUANDO É PESQUISADO PREVISÃO DE ENTREGA
    //E MAIS DE UM VEÍCULO ESTARÁ NO MESMO CLIENTE)
    var allMarkers = markersRange;

    var finalLatLng = latlng;

    //verifica se algum dos marcadores estão no mesmo ponto de lat e lng
    if (allMarkers.length != 0) {
      for (i = 0; i < allMarkers.length; i++) {
        var existingMarker = allMarkers[i];
        var pos = existingMarker.getPosition();

        //se existir algum marcador na mesma posição
        if (latlng.equals(pos)) {
          //atualiza a posição multiplicando por um pequeno valor e "reposicionando", neste caso, mais ou menos uns 100 metros
          var newLat = latlng.lat() + (Math.random() - .5) / 1850;// * (Math.random() * (max - min) + min);
          var newLng = latlng.lng() + (Math.random() - .5) / 1850;// * (Math.random() * (max - min) + min);
          finalLatLng = new google.maps.LatLng(newLat, newLng);
        };
      };
    };

    //VAR CRIADA PARA VERIFICAR SE VEÍCULO ESTÁ MAIS QUE 5 DIAS (NESSE CASO) SEM POSICIONAR
    var data = new Date();
    var dia = data.getDate();
    //COMO ESTOU TRABALHANDO AS DATAS COMO STRING, PRECISO ADICIONAR O NÚMERO ZERO QUANDO
    //O DÍGITO DE MÊS OU DIA FOR MENOR QUE 10 E MOSTRAR "05" E NÃO SOMENTE "5"
    if (dia < 10) { dia = '0' + dia }
    var mes = data.getMonth();
    if (mes < 10) { mes = '0' + (mes) } else { mes = mes }
    var ano = data.getFullYear();
    var hoje = new Date(ano, mes, dia);
    var pacote = new Date(dataPacote);
    var diff = Math.abs(hoje.getTime() - pacote.getTime());
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    var icone;
    //DEFININDO ÍCONE BASEADO NO STATUS E PRAZO DE ENVIO DE LOCALIZAÇÃO
    if (days >= 5 && status == 'Em Andamento') {
      icone = "img/NcarretaEmViagem.png"
    } else if(days >= 5 && status == 'Agendada'){
      icone = "img/NcarretaViagemAgen.png"
    } else if(days >= 5 && status == 'Autorizada'){
      icone = "img/NcarretaViagemAgen.png"
    } else if(days >= 5 && status == "Vazio"){
      icone = "img/NcarretaVazia.png"
    } else if(status == 'Em Andamento' || status == 'Autorizada'){
      icone = "img/carretaEmViagem.png"
    } else if(status == 'Agendada'){
      icone = "img/carretaViagemAgen.png"
    } else if(status == 'Vazio'){
      icone = "img/carretaVazio.png"
    } else {
      icone = "img/carretaEmManut.png"
    }

    var marker = new google.maps.Marker({
      map: map,
      position: finalLatLng,
      icon: icone
    });

    markersRange.push(marker);

    // Evento que dá instrução à API GOOGLE MAPS para estar alerta ao click no marcador.
    // Define o conteúdo e abre a Info Window.
    google.maps.event.addListener(marker, 'click', function () {

      // Variável que define a estrutura do HTML a inserir na Info Window.
      var iwContent = '<div id="iw_container">' +
        '<div class="iw_title"><b>IdVeículo: </b>' + idVeiculo + '</div>' +
        '<div class="iw_content"><b>Placa: </b>' + placa + 
        '<br /></div><div class="iw_content"><b>Data Atualização Sascar: </b>' + dataPacote + '</div>';

      // O conteúdo da variável iwContent é inserido na Info Window.
      infoWindow.setContent(iwContent);

      // A Info Window é aberta com um click no marcador.
      infoWindow.open(map, marker);
    
      var latS = cltLatMarker.toString();
      var lngS = cltLngMarker.toString();

      // CAMPOS ONDE MOSTRAM AS INFORMAÇÕES DO LADO ESQUERDO, QUANDO CLICADO NO ÍCONE DO CAMINHÃO.
      document.getElementById("check").checked = true;
      document.getElementById("dadosVeiculo").style.display = "block";
      document.getElementById("cooperado").value = cooperado;
      document.getElementById("motorista").value = motorista;
      document.getElementById("placa").value = placa;
      document.getElementById("status").value = status;
      document.getElementById("viagem").value = viagem;
      document.getElementById("cliente").value = cliente;
      document.getElementById("destinatario").value = destinatario;
      document.getElementById("destino").value = destino;
      document.getElementById("prevEntrega").value = prevEntrega;
      document.getElementById("placaCavalo").value = placaCavalo;
      nomeTipoVeiculo = tiposVeiculo.find(busca => (busca.codigo === tipoVeiculo));
      document.getElementById("tipoVeiculo").value = nomeTipoVeiculo.descricao;

    });
  };
  //FUNÇÃO QUE TRATA OS MARCADORES NO ZOOM PARA NÃO POLUIR A VISÃO DO USUÁRIO E MOSTRAR
  //TODOS ELES DE UMA VEZ.
  new MarkerClusterer(map, markersRange, {
    imagePath:
    "img/m",
  });
};

function clearFilter() {
  document.getElementById("my-form").reset();
}

function filtrar(markersData) {

	var dataIni = document.getElementById('dataIni').value;
	var dataFim = document.getElementById('dataFim').value;
	if(dataIni > dataFim){
		alert("A Data Final pesquisada deve ser maior ou igual a Data Inicial"); 
		return;
	};
	if(dataIni == dataFim){
		//Gambiarra por conta de não conseguirmos ajustar a data com o fuso horário.
		var a = parseInt(dataFim.substr(0,4));
		var m = parseInt(dataFim.substr(5,7));
		if(m < 10){
			m = "0" + m.toString();
		};
		var d = parseInt(dataFim.substr(8,9));
		d= d+1;
		dataMaisUm = a+"-"+m+"-"+d;
		dataFim = dataMaisUm
	};
	//Campo onde coleta a o valor digitado no campo de busca por placa ou cooperado
	var buscaPlacaOuCooperado = document.getElementById("pac-input-placa").value;
	
	if ( dataIni == null || dataIni == "" ){
		markersData = markersDataVeiculo;
	}
	else{
		markersData = markersDataEntrega;
		var rangeData = [];
		markersData.forEach(data => {
		if (data.prevEntrega >= dataIni && data.prevEntrega <= dataFim) {
			rangeData.push(data);
			markersData = rangeData;
		}
		});
		if (rangeData == null) { alert('Nenhuma entrega para o período especificado') 
		return;
		};
	};
	
	if ( buscaPlacaOuCooperado != null || buscaPlacaOuCooperado == "" ) {
		var pattern = new RegExp(buscaPlacaOuCooperado, "i");
		//Faz a busca utilizando o valor buscando em cooperados
		var resultCooperado = markersData.filter(function (a) {
		return pattern.test(a.cooperado);
		});
		//Faz a busca utilizando o valor buscando em placa
		var resultPlaca = markersData.filter(function (a) {
		return pattern.test(a.placa);
		});
    //Faz a busca utilizando o valor buscando em placa
		var resultPlacaCavalo = markersData.filter(function (a) {
    return pattern.test(a.placaCavalo);
    });

		if (buscaPlacaOuCooperado.length >= 3) {
		var pesquisa = [];
		for (let i = 0; i < resultCooperado.length; i++) {
			pesquisa.push(resultCooperado[i]);
		};
		for (let i = 0; i < resultPlaca.length; i++) {
			pesquisa.push(resultPlaca[i]);
		};
    for (let i = 0; i < resultPlacaCavalo.length; i++) {
			pesquisa.push(resultPlacaCavalo[i]);
		};
		markersData = pesquisa;
		mostraMarcadoresNoMapa(markersData);
		limpaCheckbox();
		carregaCheckbox(markersData); 
		return;
		};
		
		//Carrega tipos marcados do campo Tipo de Veículo
		var cbox = document.getElementsByName("itemCheck");
		var tiposMarcados = [];
		for (var i = 0; i < cbox.length; i++) {
		if (cbox[i].checked == true) {
			var j = cbox[i].id;
			tiposMarcados.push(j);
		};
		};
		
		//Carrega status marcados do campo Filtro Status
		var cboxS = document.getElementsByName("itemCheckStatus");
		var statusMarcados = [];
		for (var i = 0; i < cboxS.length; i++) {
		if (cboxS[i].checked == true) {
			var j = cboxS[i].id;
			statusMarcados.push(j);
		};
		};
		//Carrega veículos que não atualizam a mais de 5 dias
		var cboxN = document.getElementById("NSemAtt");
    var cboxC = document.getElementById("ComAtt");

		//Percorre array principal e busca todos os veículos com os tipos selecionados
		var tiposFiltrados = [];
		for (let i = 0; i < tiposMarcados.length; i++) {
		var j = tiposMarcados[i];
		var ids = markersData.filter(busca => (busca.tipoVeiculo === j));
		for (let k = 0; k < ids.length; k++) {
			var objetos = ids[k];
			tiposFiltrados.push(objetos);
		};
		};

		var marcadoresFiltrados = [];

		//Percorre array ja filtrado por tipo buscando veículos com os status selecionados.
		for (let i = 0; i < statusMarcados.length; i++) {
			var j = statusMarcados[i];
			if (cboxN.checked == false) {
				//Dentro desse if carrega todos os veículos, tanto os que estão a mais de 5 dias sem atualizar, quanto os que não estão, 
				//é a forma do cliente ver todos os veículos
        if(cboxC.checked == true){
          var ids = tiposFiltrados.filter(busca => (busca.status === j && busca.diasSemAtualizar < 5));
          for (let k = 0; k < ids.length; k++) {
            marcadoresFiltrados.push(ids[k]);
          };
        }
				
				
			}else if(cboxN.checked == true){
				//Dentro desse if carrega SOMENTE os veículos que estão a mais de 5 dias sem atualizar
				var ids = tiposFiltrados.filter(busca => (busca.status === j && busca.diasSemAtualizar >= 5));
				for (let k = 0; k < ids.length; k++) {
					marcadoresFiltrados.push(ids[k]);
				};
        if(cboxC.checked == true){
          var ids = tiposFiltrados.filter(busca => (busca.status === j && busca.diasSemAtualizar < 5));
          for (let k = 0; k < ids.length; k++) {
            marcadoresFiltrados.push(ids[k]);
          };
        }
			}
		};
		//console.log apenas para visualização da quantidade de objetos dentro do array mostrado na tela.
		console.log("Marcadores Filtrados: ")
		console.log(marcadoresFiltrados.length)

		mostraMarcadoresNoMapa(marcadoresFiltrados); 

		//Aqui escuta o click do botão relatório
		document.querySelector('#relatorio').onclick = function() {  
			downloadRelatorio(marcadoresFiltrados);
		};

		const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const EXCEL_EXTENSION = '.xlsx';

		//Função que prepara os dados dos marcadores filtrados para salvar em excel
		function downloadRelatorio(data){
			const worksheet = XLSX.utils.json_to_sheet(data);
			const workbook = {
				Sheets:{
				'Veículos filtrados': worksheet
				},
				SheetNames: ['Veículos filtrados']
			};
			const excelBuffer = XLSX.write(workbook, {booktype: 'xlsx', type: 'array'});
			salvaExcel(excelBuffer, 'Relatório');
		};

		//Função que efetivamente salva em excel utilizando o arquivo "filesaver.js"
		function salvaExcel(buffer, filename){
			const data = new Blob([buffer], { type: EXCEL_TYPE});
			saveAs(data, filename+'_export_'+new Date().getTime()+EXCEL_EXTENSION);
		};
	};
};

function limpaCheck(){
	var cbox = document.getElementsByName("itemCheck");
	for (var i = 1; i < cbox.length; i++) {
		
		if (cbox[0].checked == true) {
			cbox[i].checked = true
		}else{
			cbox[i].checked = false
		}
	};
}
