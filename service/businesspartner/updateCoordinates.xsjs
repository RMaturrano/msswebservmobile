$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;
var query;
var conn;

try{
    var params = $.request.body.asString();
	
	if (params !== undefined)
	{
	    var objLocation = JSON.parse(params);
	    var dbname = functions.GetDataBase(objLocation.Empresa);
	    conn = $.db.getConnection();
	    query = ' UPDATE '+dbname+'."CRD1" SET "U_MSSM_LAT" =\''+objLocation.Latitud+'\', ' +
	                                       '   "U_MSSM_LON" = \'' + objLocation.Longitud + '\' ' + 
	            ' where "CardCode" = \'' + objLocation.CodigoCliente + '\' and "Address" = \'' + objLocation.CodigoDireccion + '\'';
        var pstmt = conn.prepareStatement(query);   
        objCount = pstmt.executeUpdate();
        conn.commit();
        
        if(objCount > 0){
            objType = Constants.SUCCESS_OBJECT_RESPONSE;
            objResult = functions.CreateJSONMessage(100, "Coordenadas actualizadas. ");
        }else{
            objType = Constants.ERROR_MESSAGE_RESPONSE;  
		    objResult = functions.CreateJSONMessage(-101, "No se pudo completar la actualizacion." + query);
        }
	    
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;  
		objResult = functions.CreateJSONMessage(-100, "No ha ingresado los parámetros de entrada.");
	}
	
	objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse,objType);
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;  
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}finally{
    conn.close();
}