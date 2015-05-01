var liq1 = 0;
var liq2 = 0;
function updateQuali (form, classs) {    
    var alloptions = Array("Nenhuma", "Fundamental Completo", "Médio Completo", "Médio Técnico", "Graduação Completa", "Especialização", "Mestrado", "Doutorado");
    var allvalues = Array(0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.52, 0.75);
    var newoptions = Array();
    var newvalues = Array();
    var classe = parseFloat(classs);     
    if (classe <= 11) {
        newoptions = alloptions;
        newvalues = allvalues;
    } else if (classe == 17) {
        newoptions = alloptions.slice(3, alloptions.length);
        newvalues = allvalues.slice(3, alloptions.length);
        newoptions.splice(0, 1, "Exigência Mínima");
        newvalues.splice(0, 1, 0);
    } else if (classe == 31) {
        newoptions = alloptions.slice(4, alloptions.length);
        newvalues = allvalues.slice(4, alloptions.length);
        newoptions.splice(0, 1, "Exigência Mínima");
        newvalues.splice(0, 1, 0);
    }    
    while (form.ddQuali.options.length ) form.ddQuali.options[0] = null;
    for (i = 0; i < newoptions.length; i++ ) {
        // Create a new drop down option with the
		// display text and value from arr
		option = new Option(newoptions[i], newvalues[i]);
		// Add to the end of the existing options
		form.ddQuali.options[form.ddQuali.length] = option;
    }
    calcSalario (form);
}

function firstload() {
    updateQuali(myform, 1);
    updateQuali(myform2, 1);
}
function validateGD1(evt, form) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();    
    } 
}
function validateGD2(form) {
    var valor = form.gastoTrans.value;
    if (valor > 20) {
        valor = valor.toString().substring(0, valor.length-1);  
        if (valor > 20) {
            valor = valor.toString().substring(0, valor.length-1);  
        }
    } else {
        valor = parseInt(valor, 10);
    }
    form.gastoTrans.value = valor;
    calcSalario(form);
}
function formatValor(valor) {
    var intRegex = /^\d+$/;
    if (valor === 0) {
        return "R$ 0,00";
    } else if(intRegex.test(valor)) {
        return "R$ " + valor + ",00";
    } else if(intRegex.test(valor*10)) {
        return "R$ " + valor.toString().replace(".", ",") + "0";
    } else {
        return "R$ " + valor.toString().replace(".", ",");
    }
    
}
function valorIRRF (base, periodo) {
    var aliquota = 0;
    if (periodo == 1) { // Ano 2013
        if (base < 1710.79) {
            aliquota = 0;
        }  else if (base < 2563.92) {
            aliquota = base*0.075 - 128.31;
        } else if (base < 3418.60) {
            aliquota = base*0.15 - 320.60;
        } else if (base < 4271.59) {
            aliquota = base*0.225 - 577.00;
        } else {
            aliquota = base*0.275 - 790.58;
        }
    } else { //Ano 2014 pra frente
        if (base <= 1787.77) {
            aliquota = 0;
        }  else if (base <=2679.29) {
            aliquota = base*0.075 - 134,08;
        } else if (base <= 3572.43) {
            aliquota = base*0.15 - 335,03;
        } else if (base <= 4463.81) {
            aliquota = base*0.225 - 602.96;
        } else {
            aliquota = base*0.275 - 826.15;
        }
    }
    return Math.floor(aliquota*100)/100;
}
function valorSaude (bruto, ftidade) {
    var tabela = Array();
    tabela[0] = Array(121.94, 127.69, 129.42, 134.60, 138.62, 143.22, 154.98, 157.44, 159.90, 167.70);
    tabela[1] = Array(116.19, 121.94, 123.67, 127.69, 131.72, 136.32, 147.42, 149.76, 152.10, 159.90);
    tabela[2] = Array(110.44, 116.19, 117.92, 121.94, 125.97, 130.57, 139.86, 142.08, 144.30, 152.10);
    tabela[3] = Array(105.84, 110.44, 112.16, 116.19, 120.22, 124.82, 133.56, 135.68, 137.80, 144.30);
    tabela[4] = Array(100.08, 105.84, 107.56, 110.44, 114.46, 119.07, 127.26, 129.28, 131.30, 137.80);
    tabela[5] = Array(90.88, 93.18, 94.91, 95.48, 99.51, 104.11, 105.84, 107.52, 109.20, 111.80);
    tabela[6] = Array(87.43, 88.58, 90.31, 90.88, 94.91, 99.51, 100.80, 102.40, 104.00, 106.60);
    tabela[7] = Array(82.83, 83.98, 85.70, 86.28, 90.31, 94.91, 95.76, 97.28, 98.80, 101.40);
    var ftbruto = 0;    
    if (bruto < 1500) { ftbruto = 0; }
    else if (bruto < 2000) { ftbruto = 1; }
    else if (bruto < 2500) { ftbruto = 2; }
    else if (bruto < 3000) { ftbruto = 3; }
    else if (bruto < 4000) { ftbruto = 4; }
    else if (bruto < 5500) { ftbruto = 5; }
    else if (bruto < 7500) { ftbruto = 6; }
    else { ftbruto = 7; }        
    return tabela[ftbruto][ftidade];  
}
function valorCreche(bruto) {
    var desc = 0;
    if (bruto < 6200.8) { desc = 0.05; }
    else if (bruto < 12401.6) { desc = 0.1; }
    else if (bruto < 18602.4) { desc = 0.15; }
    else if (bruto < 24803.2) { desc = 0.2; }
    else { desc = 0.25 ;
    }
    return 95*(1-desc);
}
function valorTransporte(vencimento, gasto) {
    var auxilio = 0;
    var gastodiaro = 0;
    if (isNaN(gasto) || gasto < 0) {
        gastodiario = 0;
    } else {
        gastodiario = Math.ceil((gasto-1)/0.2)*0.2 + 1;
    }
    auxilio = gastodiario*22 - vencimento*0.06*(22/30);
    if (auxilio < 0) {
        return 0;
    } else {
        return auxilio;
    }
}
function valorFG(FG, periodo) {
    var FG2013 = Array(0, 777.26, 522.90, 423.94, 215.78, 175.09, 128.40, 81.89, 60.57, 49.15);
    var FG2014 = Array(0, 790.75, 531.99, 431.30, 219.54, 187.14, 130.63, 83.31, 61.61 , 50.00);
    var FG2015 = Array(0, 804.49, 541.23, 438.79, 223.35, 181.23, 132.89, 84.75, 62.69, 50.86);
    var valor = 0;
    if (periodo == 1) { valor = FG2013[FG]; }
    else if (periodo <= 2) { valor = FG2014[FG]; }
    else { valor = FG2015[FG]; }
    return valor;
}
function calcSalario (form) {      
    var ftstep = 1.036;
    var base = 1086.32;
    var periodo = parseInt(form.ddAno.value, 10);
    if (form.medico.checked) {
        ftstep = 1.038;
        if (periodo <= 4) {        
            base = 2281.27;
        } else {        
            base = 2395.33;        
        }
    } else {
        if (periodo == 1) {
            ftstep = 1.036;
            base = 1086.32;
        } else if (periodo == 2) {
            ftstep = 1.037;
            base = 1086.32;
        } else if (periodo == 3) {
            ftstep = 1.037;
            base = 1140.64;
        } else if (periodo == 4) {
            ftstep = 1.038;
            base = 1140.64;
        } else if (periodo == 5) {
            ftstep = 1.038;
            base = 1197.67;
        }   
    }
    var ftvb = parseFloat(form.ddClasse.value) + parseFloat(form.ddNivel.value) + parseFloat(form.ddProg.value) - 3;   
    var ftcarga = form.ddCargaH.value;    
    var vencimento =  Math.floor(base * (Math.pow(ftstep, ftvb)) * ftcarga * 100) / 100; 
    var baseurp = vencimento;//Math.round(base * (Math.pow(ftstep, parseFloat(form.ddClasse.value)-1)) * ftcarga * 100) / 100;
    // baseurp no meu contracheque de jan/15 veio sem a progressão, mas o VB veio com. Se for a regra, usar comentado acima, senão, apagar baseurp e substituir por vencimento na formula da urp abaixo.
    var alimentacao = 0;
    if (ftcarga == 0.5) {
        alimentacao = (form.alim.checked) ? 373/2 : 0;
    } else {
        alimentacao = (form.alim.checked) ? 373 : 0;
    }    
    var transporte = (form.trans.checked) ? valorTransporte(vencimento, form.gastoTrans.value) : 0;
    var ftinsa = (form.insa.checked) ? 0.1 : 0;
    var ftpg = form.ddQuali.value;    
    var urp = (!form.removeurp.checked) ? baseurp*0.2605 : 0;
    var remuneracao = vencimento + urp + ftpg*(vencimento+urp) +  Math.floor(ftinsa*vencimento*100)/100;    
    var saude = (form.saude.checked) ? valorSaude(remuneracao, parseInt(form.ddIdade.value, 10)) : 0;
    var creche = (form.creche.checked) ? valorCreche(remuneracao) : 0;    
    var fungrat = valorFG(parseInt(form.ddFG.value, 10), periodo);    
    var bruto = remuneracao + saude + alimentacao + transporte + creche + fungrat;
    var baseinss = vencimento + urp + ftpg*(vencimento+urp);
    var aliqinss = Math.floor(baseinss*0.11*100)/100;
    var baseirrf = baseinss + ftinsa*vencimento + fungrat + creche - aliqinss;
    var aliqirrf = valorIRRF(baseirrf, periodo);             
    var salario = Math.round((bruto - aliqirrf - aliqinss)*100)/100;
    if (form.name == "myform") {
        liq1 = salario;
    }  else {
        liq2 = salario;
    }
    document.getElementById("diffLiqAbs").value = formatValor(Math.abs(Math.round((liq1-liq2)*100)/100));    
    document.getElementById("diffLiqPor").value = Math.round(100*liq2/liq1) + "%";     
    form.txVB.value = formatValor(vencimento);
    form.txResult.value = formatValor(salario);    
    form.txInsa.value = formatValor(Math.floor(ftinsa*vencimento*100)/100);
    form.txInss.value = formatValor(Math.round(aliqinss*100)/100);
    form.txBruto.value = formatValor(Math.round(bruto*100)/100);
    form.txIrrf.value = formatValor(Math.round(aliqirrf*100)/100);    
    form.txSaude.value = formatValor(saude);
    form.txTrans.value = formatValor(Math.round(transporte*100)/100);
    form.txAlim.value = formatValor(alimentacao);
    form.txCreche.value = formatValor(creche);
    form.txURP.value = formatValor(Math.round((urp+ftpg*(vencimento+urp))*100)/100);
    form.txbIRRF.value = formatValor(Math.round(baseirrf*100)/100);
    form.txbINSS.value = formatValor(Math.round(baseinss*100)/100);
    form.txdesconto.value = formatValor(Math.round((aliqirrf+aliqinss)*100)/100);
    
}