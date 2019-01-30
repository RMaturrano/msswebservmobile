$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query = '';

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
    /*    var query = 'SELECT     ' +
                    	' T0."AcctCode" AS "Codigo", ' +
                    	' T0."AcctName" AS "Nombre" ' +
                    ' FROM ' + dbname + '.OACT T0 ' +
                    ' WHERE T0."Finanse" = \'Y\' AND LEFT(T0."AcctCode",3) = \'103\'  ' +
                    ' AND T0."AcctName" LIKE \'%MN%\' ';        */
                    
        query = 'select 	T0."CTA_TRANSFERENCIA" as "Codigo",  ' +
                    '    		T1."AcctName" as "Nombre", ' +
                    '    		\'T\' AS "Tipo" ' +
                    '    FROM '+ Constants.BD_MOBILE+'."EMPRESAS" T0 JOIN ' +
                    '    	' + dbname + '."OACT" T1 ON T0."CTA_TRANSFERENCIA" = T1."AcctCode" ' +
                    '    WHERE T0."CTA_TRANSFERENCIA" IS NOT NULL and T0."id" = ' + empId +
                    '    	UNION ' +
                    '    select 	T0."CTA_CHEQUE" as "Codigo",  ' +
                    '    		T1."AcctName" as "Nombre" , ' +
                    '    		\'C\' as "Tipo" ' +
                    '    FROM '+ Constants.BD_MOBILE+'."EMPRESAS" T0 JOIN ' +
                    '    	' + dbname + '."OACT" T1 ON T0."CTA_CHEQUE" = T1."AcctCode" ' +
                    '    WHERE T0."CTA_CHEQUE" IS NOT NULL and T0."id" = ' + empId +
                    '    	UNION  ' +
                    '    select 	T0."CTA_EFECTIVO" as "Codigo",  ' +
                    '    		T1."AcctName" as "Nombre" , ' +
                    '    		\'F\' as "Tipo" ' +
                    '    FROM '+ Constants.BD_MOBILE+'."EMPRESAS" T0 JOIN ' +
                    '    	' + dbname + '."OACT" T1 ON T0."CTA_EFECTIVO" = T1."AcctCode" ' + 
                    '    WHERE T0."CTA_EFECTIVO" IS NOT NULL and T0."id" = ' + empId;
	        
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
    	    objResult = functions.CreateJSONMessage(-101, "No se ha configurado las cuentas para pagos recibidos. ("+empId+")");
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