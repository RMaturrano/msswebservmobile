$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = ' SELECT ' +
                    ' 	T1."SlpCode", ' +
                    ' 	T0."DocNum" AS "Clave", ' +
                    ' 	T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, \'0\') AS "Sunat", ' +
                    ' 	TO_VARCHAR(T0."TaxDate",\'YYYYMMDD\') AS "Emision", ' +
                    ' 	DAYS_BETWEEN(T0."TaxDate",CURRENT_DATE) AS "Dias", ' +
                    ' 	T0."LicTradNum" AS "Ruc", ' +
                    ' 	T0."CardName" AS "Nombre", ' +
                    //' 	T0."Address" AS "Direccion", ' +  //HALLMARK
                    ' 	T3."PymntGroup" AS "Direccion", ' +  //HALLMARK
                    ' 	T0."DocTotal"*-1 AS "Total", ' +
                    ' 	T0."PaidToDate"*-1 AS "Pagado", ' +
                    ' 	(T0."DocTotal" - T0."PaidToDate")*-1 "Saldo" ' +
                    ' FROM '+dbname+'.ORIN T0   ' +
                    ' 	INNER JOIN '+dbname+'.OSLP T1 ON T1."SlpCode" = T0."SlpCode" AND T1."SlpCode" <> -1 ' +
                    ' 	INNER JOIN '+dbname+'.NNM1 T2 ON T2."Series" = T0."Series" AND T2."BeginStr" IN (\'07\') ' +
                    '   LEFT JOIN '+ dbname + '.OCTG T3 ON T0."GroupNum" = T3."GroupNum" ' +
                    ' WHERE IFNULL(T0."FolioNum",0) <> 0  ' +
                    ' AND T0."CANCELED" = \'N\' ' +
                    ' AND T0."DocTotal" <> T0."PaidToDate"'; 
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
        		mResult.push(rs[i]);
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