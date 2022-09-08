(function (){
    const counterScriptBlock = document.createElement("script");
    const protocol =
        "https:" == document.location.protocol ? "https://" : "http://";
    counterScriptBlock.src =
        protocol + "js.primegate.ru/counter.js?" + new Date().getTime();
    document.documentElement
        .getElementsByTagName("head")[0]
        .appendChild(counterScriptBlock);

})();