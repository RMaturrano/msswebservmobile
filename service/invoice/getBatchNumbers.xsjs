$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mConn;

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT DISTINCT  T3."BatchNum" as "NroLote", ' +
                     '   				T3."Quantity" as "Cantidad", ' +
                     '   				T3."BaseLinNum" as "LineaBase", ' +
                     '                  T0."DocEntry" as "Clave" ' +
                     '   FROM '+dbname+'.OINV T0 INNER JOIN '+dbname+'.INV1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
                     
                     '   LEFT OUTER JOIN '+dbname+'.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
                     '  	WHERE  T3."BatchNum" IS NOT NULL AND T0."DocTotal" <> T0."PaidToDate" ' +
                      '  	AND T0."CANCELED" = \'N\' ' +
                      '   AND  (SELECT IFNULL(COUNT("U_MSS_COVE"),0) FROM ' + dbname + '.CRD1 WHERE ' +
                       ' "CardCode" = T0."CardCode" AND "AdresType" = \'S\' AND "U_MSS_COVE" = \'' +cove+ '\' ) > 0 ' + 
                      '  	AND IFNULL(T0."U_MSSM_CRM",\'N\') = \'Y\' ' +
                      '  	AND T0."SlpCode" = \'' +cove+ '\' ' +
                      '     AND TO_VARCHAR(T0."DocDate", \'YYYYMMDD\') >= TO_VARCHAR(ADD_DAYS(CURRENT_DATE,-60),\'YYYYMMDD\')' + 
                      '  	AND IFNULL(T0."FolioNum",0) <> 0; ';
	        
    	mConn = $.hdb.getConnection();
    	var rs = mConn.executeQuery(query);
    	//conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mIncomingPayment = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mIncomingPayment = '{'; 
    		    mIncomingPayment += '"Lote": "' + rs[i].NroLote + '",';
        		mIncomingPayment += '"Cantidad": ' + rs[i].Cantidad + ',';
        		mIncomingPayment += '"LineaBase": ' + rs[i].LineaBase + ',';
        		mIncomingPayment += '"ClaveFactura": ' + rs[i].Clave ;
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
}finally{
    mConn.close();
}