$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var cove;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');
    cove = $.request.parameters.get('cove');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        query = ' select DISTINCT T0.\"Code\" AS \"Codigo\", ' + 
                    	'	T0.\"Name\" AS \"Nombre\"  '+
                '    from '+dbname+'."@MSS_ZONA" T0 JOIN '+dbname+'."@MSS_RUTA" T1 ' + 
                '     ON T0."Code" = T1."U_MSS_ZONA" ';
                //+ ' AND T1."U_MSS_COVE" = ' + cove;

    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	
    	if (rs.length > 0)
    	{
	        var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    activity = '{';   
    		    activity += '"Codigo": "'+rs[i].Codigo+'",';
    		    activity += '"Nombre": "'+rs[i].Nombre+'"';
    		    activity += "}";
            	mResult.push(JSON.parse(activity));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;

    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message + '-' + activity);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}