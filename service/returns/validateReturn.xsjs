$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var query;

try{
 
    var empId = $.request.parameters.get('empId');
    var claveMovil = $.request.parameters.get('clave');
    
    if (empId !== undefined && claveMovil !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        query = 'select count("DocEntry") as "Res", "DocEntry" from '+dbname+'.ORDN where "U_MSSM_CLM" = \''+claveMovil+'\' '+
                '  GROUP BY "DocEntry" ';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();

        var message = "-1";
        if(rs.length > 0){
            objCount = parseInt(rs[0].Res);
        	    
    	    if(objCount === 1)
    	    {
    	        message = rs[0].DocEntry;
    	    }
        }else{
            objCount = 0;
        }
        
	    objType = Constants.SUCCESS_OBJECT_RESPONSE;
	    objResult = functions.CreateJSONMessage(100, message, 1);
	
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message, 1);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);    
}
