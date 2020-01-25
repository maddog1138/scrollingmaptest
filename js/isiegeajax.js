

function IsiegeAjax() {
  
  var xmlHttp = null;
  
  
  /*-------------------------------------------------------------------------------------
  this method returns the XMLHttpRequest object.  
  In the instance of InternetExplorer, the object returned is the ActiveXObject
  -------------------------------------------------------------------------------------*/
  this.getXMLHttpRequest = function() {
    try { return new XMLHttpRequest();} catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP");} catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP");} catch (e) {}
    alert("Your browser does not seem to support Ajax!");
    return null;
  }
  
  /*-------------------------------------------------------------------------------------
  send the request to the server.
  TODO: need to do the "clear" to get ready for next request.
  -------------------------------------------------------------------------------------*/
  this.fireRequest = function(url, param, callback) {
    if (this.xmlHttp == null) {
      this.xmlHttp = this.getXMLHttpRequest();
    }
    this.xmlHttp.onreadystatechange = callback;
    this.xmlHttp.open('GET', url + param, true);
    this.xmlHttp.send(null);
  }
  
  IsiegeAjax.prototype.getXmlHttp = function() {
    return this.xmlHttp;
  }
}