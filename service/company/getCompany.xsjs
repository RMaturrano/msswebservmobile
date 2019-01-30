$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objError;
var objResult;
var objType;
var objCount = 0;

try{

	var query = 'select * from "SBO_MSS_MOBILE"."EMPRESAS"';
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
        objCount = mResult.length;
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros.");
	}
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objError = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objError, 1);
	functions.DisplayJSON(objResponse,objType);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}