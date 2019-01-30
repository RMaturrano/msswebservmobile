$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

function ObtenerLineas(clave, database, tipo){
    
    try {
        
        var mQuery = '';
        
        if(tipo === 'A'){
            mQuery = 'SELECT  ' +
                     '   	T0."DocNum"  AS "Clave", ' +
                     '   	T0."DocEntry"  AS "FacturaCliente", ' +
                     '   	T0."SumApplied"  AS "Importe"  ' +
                     '   FROM ' + database + '.RCT2 T0  ' +
                     '   INNER JOIN ' + database + '.ORCT T1  ON T1."DocEntry" = T0."DocNum"' +
                	' where T1."DocEntry" = ' + clave;
        }else{
            mQuery = 'SELECT  ' +
                      '  	T0."DocNum"  AS "Clave", ' +
                      '  	T0."DocEntry"  AS "FacturaCliente", ' +
                      '  	T0."SumApplied"  AS "Importe"  ' +
                      '  FROM ' + database + '.PDF2 T0  ' +
                      '  INNER JOIN ' + database + '.OPDF T1  ON T1."DocEntry" = T0."DocNum" ' +
                	' where T1."DocEntry" = ' + clave;
        }
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mIncomingPaymentLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mIncomingPaymentLine = '{'; 
        		mIncomingPaymentLine += '"Clave": ' + mRS[j].Clave + ',';
        		mIncomingPaymentLine += '"FacturaCliente": ' + mRS[j].FacturaCliente + ',';
        		mIncomingPaymentLine += '"Importe": "' + mRS[j].Importe + '"';
        		mIncomingPaymentLine += "}";
        		
        		mLines.push(mIncomingPaymentLine);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

try{
 
    var empId = $.request.parameters.get('empId');
    var usrId = $.request.parameters.get('usrId');
    
    if (empId !== undefined && usrId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT  ' +
                        '	\'A\' AS "Tipo", ' +
                        ' 	T0."DocEntry"  AS "Clave", ' +
                        ' 	T0."DocNum"  AS "Numero", ' +
                        ' 	T0."CardCode" AS "SocioNegocio", ' +
                        ' 	IFNULL(T0."CounterRef", -1) AS "EmpleadoVenta", ' +
                        ' 	IFNULL(T0."Comments",\'\') AS "Comentario", ' +
                        ' 	IFNULL(T0."JrnlMemo",\'\') AS "Glosa", ' +
                        ' 	TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') AS "FechaContable", ' +
                        ' 	T0."DocCurr" AS "Moneda", ' +
                        ' 	CASE WHEN T0."CheckSum" > 0 THEN \'C\' WHEN T0."TrsfrSum" > 0 THEN \'T\' WHEN T0."CashSum"  > 0 THEN \'F\' END AS "TipoPago", ' +
                        ' 	IFNULL(T0."TrsfrAcct",\'\') AS "TransferenciaCuenta", ' +
                        ' 	IFNULL(T0."TrsfrRef",\'\') AS "TransferenciaReferencia", ' +	
                        ' 	T0."TrsfrSum" AS "TransferenciaImporte", ' +
                        ' 	IFNULL(T0."CashAcct",\'\') AS "EfectivoCuenta",   ' +
                        ' 	T0."CashSum"  AS "EfectivoImporte", ' +
                        ' 	IFNULL(T0."U_MSSM_CRM",\'N\') AS "CreadMovil", ' +
                        ' 	IFNULL(T0."U_MSSM_CLM",\'\') AS "ClaveMovil", ' +
                        ' 	IFNULL((SELECT  T10."CheckAct"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeCuenta", ' +
                        ' 	IFNULL((SELECT  T10."BankCode"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeBanco", ' +
                        ' 	IFNULL((SELECT  TO_VARCHAR(T10."DueDate",\'YYYYMMDD\') FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeVencimiento", ' +
                        ' 	IFNULL((SELECT  T10."CheckSum"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),0) AS "ChequeImporte", ' +
                        ' 	IFNULL((SELECT  T10."CheckNum"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),-1) AS "ChequeNumero", ' +
                        ' 	IFNULL(T0."U_MSSM_TRM",\'01\') AS "TransaccionMovil" ' +
                        ' FROM ' + dbname + '.ORCT T0 ' +
                        ' WHERE T0."DocType" = \'C\'  ' +
                        ' 	AND T0."Canceled" = \'N\'  ' +
                        ' 	AND IFNULL(T0."U_MSSM_CRM",\'N\') = \'Y\' ' +
                        ' 	AND IFNULL(T0."U_MSSM_TRM",\'01\') <> \'01\' AND T0."CounterRef" = \''+usrId+'\' ' +
                        '   AND TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') = CURRENT_DATE ' +
                        ' 	    UNION ' +
                        ' SELECT ' +
                        ' 	\'P\' AS "Tipo", ' +
                        ' 	T0."DocEntry"  AS "Clave", ' +
                        ' 	T0."DocNum"  AS "Numero", ' +
                        ' 	T0."CardCode" AS "SocioNegocio", ' +
                        ' 	IFNULL(T0."CounterRef", -1) AS "EmpleadoVenta", ' +
                        ' 	IFNULL(T0."Comments",\'\') AS "Comentario", ' +
                        ' 	IFNULL(T0."JrnlMemo",\'\') AS "Glosa", ' +
                        ' 	TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') AS "FechaContable", ' +
                        ' 	T0."DocCurr" AS "Moneda", ' +
                        ' 	CASE WHEN T0."CheckSum" > 0 THEN \'C\' WHEN T0."TrsfrSum" > 0 THEN \'T\' WHEN T0."CashSum"  > 0 THEN \'F\' END AS "TipoPago", ' +
                        ' 	IFNULL(T0."TrsfrAcct",\'\') AS "TransferenciaCuenta", ' +
                        ' 	IFNULL(T0."TrsfrRef",\'\') AS "TransferenciaReferencia",	 ' +
                        ' 	T0."TrsfrSum"  AS "TransferenciaImporte", ' +
                        ' 	IFNULL(T0."CashAcct",\'\') AS "EfectivoCuenta", ' +
                        ' 	T0."CashSum"  AS "EfectivoImporte", ' +
                        ' 	IFNULL(T0."U_MSSM_CRM",\'N\') AS "CreadMovil", ' +
                        ' 	IFNULL(T0."U_MSSM_CLM",\'\') AS "ClaveMovil", ' +
                        ' 	IFNULL((SELECT  T10."CheckAct"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeCuenta", ' +
                        ' 	IFNULL((SELECT  T10."BankCode"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeBanco", ' +
                        ' 	IFNULL((SELECT  TO_VARCHAR(T10."DueDate",\'YYYYMMDD\') FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),\'\') AS "ChequeVencimiento", ' +
                        ' 	IFNULL((SELECT  T10."CheckSum"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),0) AS "ChequeImporte", ' +
                        ' 	IFNULL((SELECT  T10."CheckNum"  FROM ' + dbname + '.PDF1 T10 WHERE T10."DocNum" = T0."DocEntry" ),-1) AS "ChequeNumero", ' +
                        ' 	IFNULL(T0."U_MSSM_TRM",\'01\') AS "TransaccionMovil" ' +
                        ' FROM ' + dbname + '.OPDF T0 ' +
                        ' WHERE T0."DocType" = \'C\' ' +
                        ' 	AND T0."ObjType" = \'24\'  ' +
                        ' 	AND T0."Canceled" = \'N\' ' +
                        ' 	AND IFNULL(T0."U_MSSM_CRM",\'N\') = \'Y\' ' +
                        '   AND TO_VARCHAR(T0."DocDate",\'YYYYMMDD\') = CURRENT_DATE ' +
                        ' 	AND IFNULL(T0."U_MSSM_TRM",\'01\') <> \'01\' AND T0."CounterRef" = \''+usrId+'\' ;'; 
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mIncomingPayment = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mIncomingPayment = '{';   
    			mIncomingPayment += '"Tipo": "'+rs[i].Tipo+'",';
        		mIncomingPayment += '"Clave": '+rs[i].Clave+',';
        		mIncomingPayment += '"Numero": '+rs[i].Numero+',';
        		mIncomingPayment += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		mIncomingPayment += '"EmpleadoVenta": '+rs[i].EmpleadoVenta+',';
        		mIncomingPayment += '"Comentario": "'+rs[i].Comentario+'",';
        		mIncomingPayment += '"Glosa": "'+rs[i].Glosa+'",';
        		mIncomingPayment += '"FechaContable": "'+rs[i].FechaContable+'",';
        		mIncomingPayment += '"Moneda": "'+rs[i].Moneda+'",';
        		mIncomingPayment += '"TipoPago": "'+rs[i].TipoPago+'",';
        		mIncomingPayment += '"TransferenciaCuenta": "'+rs[i].TransferenciaCuenta+'",';
        		mIncomingPayment += '"TransferenciaReferencia": "'+rs[i].TransferenciaReferencia+'",';
        		mIncomingPayment += '"TransferenciaImporte": "'+rs[i].TransferenciaImporte+'",';
        		mIncomingPayment += '"EfectivoCuenta": "'+rs[i].EfectivoCuenta+'",';
        		mIncomingPayment += '"EfectivoImporte": "'+rs[i].EfectivoImporte+'",';
        		mIncomingPayment += '"CreadMovil": "'+rs[i].CreadMovil+'",';
        		mIncomingPayment += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		mIncomingPayment += '"ChequeCuenta": "'+rs[i].ChequeCuenta+'",';
        		mIncomingPayment += '"ChequeBanco": "'+rs[i].ChequeBanco+'",';
        		mIncomingPayment += '"ChequeVencimiento": "'+rs[i].ChequeVencimiento+'",';
        		mIncomingPayment += '"ChequeImporte": "'+rs[i].ChequeImporte+'",';
        		mIncomingPayment += '"ChequeNumero": "'+rs[i].ChequeNumero+'",';
        		mIncomingPayment += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
        		mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname, rs[i].Tipo) + ']';
        		mIncomingPayment += "}";
        		
        		mResult.push(JSON.parse(mIncomingPayment));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
    	    functions.DisplayJSON(objResponse, objType);
    	    
    	}else{
    	    objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
    	}
    	
	}else{
	    objType = "MessageError";
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	}
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}