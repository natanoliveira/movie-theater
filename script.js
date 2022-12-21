// Constantes e variáveis gerais
const POLTRONAS = 240
var RESERVADAS = []
const marginRight = 'mr-5'
const dadosLocais = 'teatroOcupadas'

const inputChair = document.getElementById('inputChair')
const btnReserve = document.getElementById('btnReserve')
const btnConfirm = document.getElementById('btnConfirm')
const boxStage = document.getElementById('boxStage')

btnReserve.addEventListener("click", reservar)
btnConfirm.addEventListener("click", confirmar)

inputChair.addEventListener("keypress", function (tecla) {
    // Caso seja a tecla ENTER/RETURN chama a função desejada
    // console.log(tecla.code) Enter
    // console.log(tecla.key) Enter
    // console.log(tecla.which) 13 (Depreciada)
    if (tecla.code == 'Enter' || tecla.key == 'Enter' || tecla.which == 13) {
        reservar()
    }
})

// Monta as poltronas do palco ao iniciar a página
montarPalco()

function montarPalco() {

    var OCUPADAS = []

    // Verifica se há dados locais
    if (localStorage.getItem(dadosLocais)) {
        OCUPADAS = localStorage.getItem(dadosLocais).split(';')
    }

    // Preparando para criar a quantidade esperada de poltronas
    for (var i = 1; i <= POLTRONAS; i++) {

        // Item de poltrona
        var chair = document.createElement('div')
        var classe = '';

        // Trabalhando qual classe a poltrona irá ter
        if (OCUPADAS.indexOf(i.toString()) >= 0) {
            // Ocupada
            classe = 'poltrona bg-danger'
        } else {
            // Livre
            classe = 'poltrona bg-secondary'
        }

        var zeros = ''

        // Numeração das poltronas
        if (i < 10) {
            zeros = '00'
        } else if (i < 100) {
            zeros = '0'
        }

        var numChair = zeros + i
        chair.textContent = numChair

        // Trabalhando a margem direita para que estiver no corredor central
        var margem = '';

        if (i % 24 == 12) {
            margem = marginRight
        }

        chair.className = classe + ' ' + margem

        boxStage.appendChild(chair)

        // para quem for do final da fila horizontal quebra a linha
        if (i % 24 == 0) {
            var BR = document.createElement('br')
            boxStage.appendChild(BR)
        }
    }
}

function reservar() {

    var numPoltrona = Number(inputChair.value)

    // Validação
    if (isNaN(numPoltrona) || numPoltrona <= 0 || numPoltrona > POLTRONAS) {
        alert('Digite o número de poltrona em que deseja reservar')
        inputChair.focus()
        return
    }

    // Reiniciando vetor
    var OCUPADAS = []

    // Verificando se há dados gravados localmente e atribuindo para o vetor
    if (localStorage.getItem(dadosLocais)) {
        OCUPADAS = localStorage.getItem(dadosLocais).split(';')
    }

    // Verificando se há algum item no vetor e validando
    if (OCUPADAS.indexOf(numPoltrona.toString()) >= 0) {
        alert('Poltrona ' + numPoltrona + ' já ocupada!')
        inputChair.value = ''
        inputChair.focus()
        return
    }

    // Capturando poltrona equivalente a digitada
    var item = boxStage.getElementsByTagName('div')[numPoltrona - 1]

    // console.log(item)
    // console.log(item.classList)

    // Aqui testamos se há a classe de margem direita para podermos 
    // trabalhar qual classe irá assumir 
    if (item.classList[2] == marginRight) {
        item.className = 'poltrona bg-info ' + marginRight
    } else {
        item.className = ''
        item.className = 'poltrona bg-info'
    }

    // Alimentando lista de reserva
    RESERVADAS.push(numPoltrona)

    // Limpeza e foco
    inputChair.value = ''
    inputChair.focus()

}

function confirmar() {

    // Validação
    if (RESERVADAS.length == 0) {
        alert('Não há poltronas reservadas!')
        inputChair.focus()
        return
    }

    var OCUPADAS = []

    // Verifica se há dados locais
    if (localStorage.getItem(dadosLocais)) {
        OCUPADAS = localStorage.getItem(dadosLocais)
    }

    // Varrendo as poltronas reservadas para confirma a reserva e demarcar
    for (var i = 0; i < RESERVADAS.length; i++) {

        // Preparando para gravar localmente
        OCUPADAS += RESERVADAS[i] + ';'

        // Item poltrona
        var item = boxStage.getElementsByTagName('div')[RESERVADAS[i] - 1]

        // console.log(item)

        // Trabalhando a classe para exibição da demarcação
        if (item.classList[2] == marginRight) {
            // Confirmada (de corredor)
            item.className = 'poltrona bg-danger ' + marginRight
        } else {
            // Confirmada (interna)
            item.className = ''
            item.className = 'poltrona bg-danger'
        }
    }

    // Resetando vetor
    RESERVADAS = []

    // Gravando localmente
    localStorage.setItem(dadosLocais, OCUPADAS.substring(0, OCUPADAS.length - 1))
}