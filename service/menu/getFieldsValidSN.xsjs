$.import("MSS_MOBILE.Functions", "Functions");
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
	    
	   // if(validarUsuario(userId, dbname) === "Exists"){
	        var query = 'select "Code" as "Codigo",  ' +
                        '	"Name" as "Descripción",  ' +
                        '	"U_MSSM_OBL" as "OblgLead",  ' +
                        '	"U_MSSM_OBF" as "OblgFinal",  ' +
                        '	"U_MSSM_OBC" as "OblgComp" from '+dbname+'."@MSSM_SNF"';
	        
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
        		
        		objType = "ObjectSuccess";
        	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
        	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
        	    functions.DisplayJSON(objResponse, objType);
        	    
        	}else{
        	    objType = "MessageError";
        	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
        	    objResponse = functions.CreateResponse(objType, objResult, 0);
        	    functions.DisplayJSON(objResponse, objType);
        	}
	    /*}else{
	        objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-102, "El usuario no existe. " + userId);
    	    objResponse = functions.CreateResponse(objType, objResult, 0);
    	    functions.DisplayJSON(objResponse, objType);
	    }       */
	}else{
	    objType = "MessageError";
	    objResult = functions.CreateJSONMessage(-103, "No se han recibido los parámetros de entrada.");
	    objResponse = functions.CreateResponse(objType, objResult, 0);
	    functions.DisplayJSON(objResponse, objType);
	}
	
}catch(e){
    objType = "MessageError";
	objResponse = functions.CreateJSONMessage(-9703000, e.message);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}