<?php
    
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta charset="UTF-8">
    <meta content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" name="viewport">
    <link rel="stylesheet" href="style.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Gerenciador Logístico Coopercargo</title>
    
    <script src="js/index.js"></script>
    <script src="js/filesaver.js"></script>
    <script src="https://unpkg.com/@googlemaps/markerclustererplus/dist/index.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.2/xlsx.full.min.js"></script>
    <script src="js/funcoes.js"></script>
    
    <script defer
    src="https://maps.googleapis.com/maps/api/js?key=chaveapi&libraries=places&callback=initMap">
    </script>
</head>
<body>
    <input type="checkbox" id="check">
    <label id="icone" for="check"><img src="img/menu.png" alt="imagem menu"></label>
    <div class="pac-card" id="pac-card">
        <div id="pac-container">
            <div id="busca">
                <input id="pac-input" type="text" placeholder="Pesquise por local..." />
                <img id="limpar" src="img/excluir.png" alt="excluir" onclick="limpa()">
            </div>
            <div id="buscaPlaca">
                <input id="pac-input-placa" type="text" placeholder="Pesquise por placa ou cooperado..."/>
                <img id="limparPlaca" src="img/excluir.png" alt="excluir" onclick="limpaPlaca()">
            </div>
        </div>
        <div>
            <div id="filtros">
                <div class="form-group">
                    <div class="input-group">
                        <input type="date" name="data" id="dataIni">
                        <input type="date" name="data" id="dataFim"> 
                    </div>
                </div>
            </div>
            <div id="botoesFiltros">
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="margin-left: 10px">
                        Tipo de Veículo
                    </button>
                    <div class="dropdown-menu" id="filtroDosVeiculos" style="min-width: 15rem">
                        <div id="divApagar"></div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="margin-left: 10px">
                        Filtro status
                    </button>
                    <div class="dropdown-menu" id="filtroDosStatus" aria-labelledby="dropdownMenuButton" style="min-width: 14rem">
                        <div id="divApagarStatus">
                        
                        </div>
                    </div>
                </div>
                <div class="btn-group">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="margin-left: 10px">
                        C/S Atualização
                    </button>
                    <div class="dropdown-menu" id="filtroDosStatusAtualizacao" aria-labelledby="dropdownMenuButton" style="min-width: 14rem">
                        <div id="divApagarStatusAtualizacao">
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>    
            <table id="dadosVeiculo">
            <tr>
                <td class="label">Cooperado</td>
                <td class="slimField">
                <input class="field" id="cooperado" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Motorista</td>
                <td class="slimField">
                <input class="field" id="motorista" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Placa</td>
                <td class="slimField">
                <input class="field" id="placa" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Status</td>
                <td class="wideField" colspan="3">
                <input class="field" id="status" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Viagem</td>
                <td class="wideField">
                <input class="field" id="viagem" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Cliente</td>
                <td class="wideField" colspan="3">
                <input class="field" id="cliente" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Destinatário</td>
                <td class="wideField" colspan="3">
                <input class="field" id="destinatario" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Origem-Destino</td>
                <td class="wideField" colspan="3">
                <input class="field" id="destino" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Previsão de entrega</td>
                <td class="wideField" colspan="3">
                <input class="field" id="prevEntrega" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Placa do Cavalo</td>
                <td class="wideField" colspan="3">
                <input class="field" id="placaCavalo" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">Tipo do Veículo</td>
                <td class="wideField" colspan="3">
                <input class="field" id="tipoVeiculo" disabled="true" />
                </td>
            </tr>
            <tr>
                <td class="label">
                
                </td>
                <td class="wideField" colspan="3">
                    <img src="img/legendaCores.png" alt="legendaCores" style="width:90%;">
                </td>
            </tr>
        </table>
        <div id="btn_aplicar_filtros">
            <button type="submit" class="btn btn-primary" onclick="filtrar()">Aplicar Filtros</button>
            <button class="btn btn-primary" id="relatorio">Exportar Relatório</button>
        </div>
        <div id="filtroVeiculo"></div>
      </div>
    </div>
    <div id="map"></div>
    <div id="infowindow-content">
      <img src="" width="16" height="16" id="place-icon" />
      <span id="place-name" class="title"></span><br />
      <span id="place-address"></span>
    </div>
  </body>
</html>