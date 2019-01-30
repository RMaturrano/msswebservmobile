$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var incomingPayment = "";

try{
    var id = $.request.parameters.get('id');

	if (id !== undefined)
	{
	    var dbname = functions.GetDataBase(id);
        var query = 'select IFNULL("ClaveMovil",\'\') AS "ClaveMovil" , ' +
                        '    IFNULL("TransaccionMovil",\'\') AS "TransaccionMovil" , ' +
                        '    IFNULL("SocioNegocio",\'\') AS "SocioNegocio" , ' +
                        '    IFNULL("EmpleadoVenta",\'\') AS "EmpleadoVenta" , ' +
                        '	 IFNULL(T2.\"SlpName\",\'\') AS \"VendedorNombre\"       ,' + 
                        '    IFNULL("Comentario",\'\') AS "Comentario" , ' +
                        '    IFNULL("Glosa",\'\') AS "Glosa" , ' +
                        '    IFNULL("FechaContable",\'\') AS "FechaContable" , ' +
                        '    IFNULL("TipoPago",\'\') AS "TipoPago" ,  ' +
                        '    IFNULL("Moneda",\'\') AS "Moneda" , ' +
                        '    IFNULL("ChequeCuenta",\'\') AS "ChequeCuenta" , ' +
                        '    IFNULL("ChequeBanco",\'\') AS "ChequeBanco" , ' +
                        '    IFNULL("ChequeVencimiento",\'\') AS "ChequeVencimiento" , ' +
                        '    IFNULL("ChequeImporte",0) AS "ChequeImporte" , ' + 
                        '    IFNULL("ChequeNumero",0) AS "ChequeNumero" , ' +
                        '    IFNULL("TransferenciaCuenta",\'\') AS "TransferenciaCuenta" , ' +
                        '    IFNULL("TransferenciaReferencia",\'\') AS "TransferenciaReferencia" , ' +
                        '    IFNULL("TransferenciaImporte",0) AS "TransferenciaImporte" , ' +
                        '    IFNULL("EfectivoCuenta",\'\') AS "EfectivoCuenta" , ' +
                        '    IFNULL("EfectivoImporte",0) AS "EfectivoImporte" , ' +
                        '    IFNULL("Comentario",\'\') AS "Comentario" , ' +
                        '    IFNULL("Migrado",\'\') AS "Migrado" , ' +
                        '    IFNULL("Actualizado",\'\') AS "Actualizado" , ' +
                        '    IFNULL("Finalizado",\'\') AS "Finalizado" , ' +
                        '    IFNULL("DocEntry",\'\') AS "DocEntry" , ' +
                        '    IFNULL("Mensaje",\'\') AS "Mensaje" ,  ' +
                        '    EMPRESA ' +
                    ' from '+Constants.BD_MOBILE+'."ORCT" T0 LEFT JOIN ' + dbname + '.OSLP T2 ' +
                '           ON T0."EmpleadoVenta" = T2."SlpCode" where "Migrado" = \'N\' AND "EMPRESA" = ' + id;
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	if (rs.length > 0)
    	{
    		
    	    var incomingPaymentLine = "";
    		var mResult = [];
    		var mDetail = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    incomingPayment = '{';   
        		incomingPayment += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		incomingPayment += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
        		incomingPayment += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		incomingPayment += '"EmpleadoVenta": "'+rs[i].EmpleadoVenta+'",';
        		incomingPayment += '"VendedorNombre": "'+rs[i].VendedorNombre+'",';
        		incomingPayment += '"Comentario": "'+rs[i].Comentario+'",';
        		incomingPayment += '"Glosa": "'+rs[i].Glosa+'",';
        		incomingPayment += '"FechaContable": "'+rs[i].FechaContable+'",';
        		incomingPayment += '"TipoPago": "'+rs[i].TipoPago+'",';
        		incomingPayment += '"Moneda": "'+rs[i].Moneda+'",';
        		incomingPayment += '"ChequeCuenta": "'+rs[i].ChequeCuenta+'",';
        		incomingPayment += '"ChequeBanco": "'+rs[i].ChequeBanco+'",';
        		incomingPayment += '"ChequeVencimiento": "'+rs[i].ChequeVencimiento+'",';
        		incomingPayment += '"ChequeImporte": '+rs[i].ChequeImporte+',';
        		incomingPayment += '"ChequeNumero": '+rs[i].ChequeNumero+',';
        		incomingPayment += '"TransferenciaCuenta": "'+rs[i].TransferenciaCuenta+'",';
        		incomingPayment += '"TransferenciaReferencia": "'+rs[i].TransferenciaReferencia+'",';
        		incomingPayment += '"TransferenciaImporte": '+rs[i].TransferenciaImporte+',';
        		incomingPayment += '"EfectivoCuenta": "'+rs[i].EfectivoCuenta+'",';
        		incomingPayment += '"EfectivoImporte": '+rs[i].EfectivoImporte+',';
        		incomingPayment += '"Migrado": "'+rs[i].Migrado+'",';
        		incomingPayment += '"Actualizado": "'+rs[i].Actualizado+'",';
        		incomingPayment += '"Finalizado": "'+rs[i].Finalizado+'",';
        		incomingPayment += '"DocEntry": "'+rs[i].DocEntry+'",';
        		incomingPayment += '"Mensaje": "'+rs[i].Mensaje+'",';
        		incomingPayment += '"EMPRESA": '+rs[i].EMPRESA+',';
        		
        		mDetail = [];
        		query = ' select  IFNULL("Linea", -1) AS "Linea", ' + 
        		                ' IFNULL("FacturaCliente", -1) AS "FacturaCliente", ' + 
        		                ' IFNULL("Importe", 0) AS "Importe" ' + 
        		        ' from '+Constants.BD_MOBILE+'."RCT1" where "ClaveMovil" = \'' + rs[i].ClaveMovil + '\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    incomingPaymentLine = '{'; 
                		incomingPaymentLine += '"Linea": ' + rsDet[j].Linea + ',';
                		incomingPaymentLine += '"FacturaCliente": ' + rsDet[j].FacturaCliente + ',';
                		incomingPaymentLine += '"Importe": ' + rsDet[j].Importe;
                		incomingPaymentLine += "}";
                		
                		mDetail.push(incomingPaymentLine);
            		}
            		
            		incomingPayment += '"Lineas": [' + mDetail.join(",") + ']';
        		    incomingPayment += "}";
        		    
            	}else{
            	    incomingPayment += '"Lineas": []';
        		    incomingPayment += "}";
            	}
            	
            	mResult.push(JSON.parse(incomingPayment));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;
    		
    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+id+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message + " - " + incomingPayment);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}