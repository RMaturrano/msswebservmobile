$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var objCount = 0;

try{
 
    var query = 'SELECT ' +
                	' T0."ID" AS "Codigo", ' +
                	' T0."DESCRIPCION" AS "Descripcion", ' +
                	' T0."HAB_ORDEN" AS "ValOrden", ' +
                	' T0."HAB_ENTREGA" AS "ValEntrega", ' +
                	' T0."HAB_FACTURA" AS "ValFactura" ' +
                ' FROM ' + Constants.BD_MOBILE + '.MOTIVOS T0 ';
        
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
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados.");
	}
	
}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}