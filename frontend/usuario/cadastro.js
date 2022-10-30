

function mascara(o,f){
    v_obj=o
    v_fun=f
    setTimeout("execmascara()",1)
}
function execmascara(){
    v_obj.value=v_fun(v_obj.value)
}
function mtel(v){
    v=v.replace(/\D/g,""); 
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2");
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");
    return v;
}
function id( el ){
	return document.getElementById( el );
}
window.onload = function(){
	id('telefone').onkeyup = function(){
		mascara( this, mtel );
	}

    const inputCpf = document.querySelector("#cpf")


inputCpf.addEventListener('keypress', function(){
    let inputLength = inputCpf.value.length
    if(inputLength === 3 || inputLength === 7){
        inputCpf.value += '.'
    }else if(inputLength === 11){
        inputCpf.value += '-'
    }
})
}