$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objResult;
var objType;
var objCount = 0;

var empId;
var query;
var activity;

try{
    empId = $.request.parameters.get('empId');

	if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        query = ' select T0.\"PrjCode\" AS \"Codigo\", ' + 
                    	'	T0.\"PrjName\" AS \"Nombre\"         ,' + 
                    	'	TO_VARCHAR(T0.\"ValidFrom\",\'YYYYMMDD\') AS \"ValidoDesde\"  ,' + 
                    	'	T0.\"Active\" AS \"Valido\" ' + 
                '    from '+dbname+'.OPRJ T0 ';

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
    		    activity += '"Nombre": "'+rs[i].Nombre+'",';
    		    activity += '"ValidoDesde": "'+rs[i].ValidoDesde+'",';
    		    activity += '"Valido": "'+rs[i].Valido+'"';
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
	objResult = functions.CreateJSONMessage(-9703000, e.message + '-' + query);
}finally{
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
}