log = function(text) {
    console.log(text);
}

getDefinitionValue = function(key) {
    return $('tr')
        .filter(function(i){return this.cells[0].innerHTML === key})
        .children(":last").text();
}


var systemTests = new Array();
var classname;
var parameters;
var returnType;
var method;

getTests = function(solutionlink) {
   $.get(solutionlink,
        function(response){
            $('td', response)
                .filter(function(i){return $(this).text() === 'Passed'})
                .parent()
                .each(function() {   
                          var testcase = new Array();
                          $(this).find('td').each(function() { 
                               var str = $(this).text();
                               str = str.replace(/\s/g,'');
                               if(str)
                                   testcase.push(str);
                          });
                          systemTests.push(testcase);
                      });

            log(systemTests);
            $('#systests > img').attr('src',chrome.extension.getURL("systest.png"));

            chrome.extension.sendRequest(
                {request: "systemTests", classname: classname, systemTests: systemTests}, 
                function(response) {
                    console.log(response.status);
                    $('#notification').show().text(response.status)
                        .delay(3000).fadeOut(500);
                }
            );

            systemTests = new Array();

		}
    );
}


var exampleTests = new Array();
parseExamples = function() {
    $('pre:contains("Returns:")')
        .each(function(){
                var params = new Array();
                $(this).closest('tr')
                       .prev()
                       .find('tr')
                       .each(function(){
                           var re = RegExp(String.fromCharCode(8629),"g");
                           params.push($(this).text()
                                       .replace(/[^\040-\176]*/g,'')); 
                       });
                var returns = $(this).html().match(/Returns: (.*)/)[1];
                var testcase = new Array(params,returns)
                exampleTests.push(testcase);
            });
    log(exampleTests);
}

parseProblemStatement = function() {

    parseExamples();

    chrome.extension.sendRequest(
        {request: "solution", classname: classname, method: method, returnType: returnType, 
         parameters: parameters, exampleTests: exampleTests, systemTests: systemTests}, 
        function(response) {
            console.log(response.status);
            $('#notification').show().text(response.status).delay(3000).fadeOut(500);
        }
    );
    exampleTests = new Array();

}

parseSystemTests = function() {
    $('a[href*="tc?module=ProblemDetail"]').first().each(function(i,x) {
        statlink = $(this).attr('href');
        $.get(statlink, function(response){
            $('a[href*=problem_solution]',response).first()
                .each(function(){
                    getTests($(this).attr('href'))
                });
		});
    });
}

$(document).ready(function() {
    classname = getDefinitionValue('Class:');

    chrome.extension.sendRequest({request: "setTitle", classname: classname},    function(response) { if(response.allowed == "true")
        document.title = classname + " : " + document.title; });

    returnType = getDefinitionValue('Returns:');    
    method = getDefinitionValue('Method:');

    var parameterString = getDefinitionValue('Parameters:');
    var methodSignature = getDefinitionValue('Method signature:');

    parameters = new Array();
    var paramsParse = methodSignature.match(/\((.*)\)/)[1].split(', ');
    $.each(paramsParse, function(i,p) {
             var type = p.split(' ')[0];
             var identifier = p.split(' ')[1];
             parameters.push([type,identifier]);
        });

    $('td:contains("Problem Statement for"):not(:has(*))')
        .append('<span style="float:right; padding:1px;">' + 
                '<a id="parseproblem" href="#"><img style="padding-right:5px" src="' + 
                chrome.extension.getURL("idea.png") +
                '"></a>' + 
                '<a id="systests" href="#"><img style="padding-right:5px" src="' + 
                chrome.extension.getURL("systest.png") +
                '"></a>' + 
                '</span>' +
               '<div id="notification"></div>');

    $('#notification')
        .css('position','absolute')
        .css('padding','10px')
        .css('color','#ddd')
        .css('right','220px')
        .css('width','200px')
        .css('font-size','10px')
        .css('font-weight','normal')
        .css('background-color','#2c3a47')
        .css('border','1px solid black')
        .hide();

    $("body").click(function() {
        $("#notification").hide();
    });

    
    $('td:contains("Problem Statement for")').append('');

    $('#parseproblem').click(function() {
        $('#parseproblem > img').attr('src',chrome.extension.getURL("loading.gif"));
        parseProblemStatement();
        $('#parseproblem > img').attr('src',chrome.extension.getURL("idea.png"));
        return false;
    });

    $('#systests').click(function() {
        $('#systests > img').attr('src',chrome.extension.getURL("loading.gif"));
        parseSystemTests();
        return false;
    });

});    