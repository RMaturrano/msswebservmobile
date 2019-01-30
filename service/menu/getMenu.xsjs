$.import("MSS_MOBILE.Functions", "Functions");
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var query;

function validarUsuario(uid, db){
    var res = "Exists";
    try{
	    var q = 'select "Code" from '+db+'."@MSSM_CVE" where "U_MSSM_USR" = \'' + uid + '\'';
    	var c = $.hdb.getConnection();
    	var r = c.executeQuery(q);
    	c.close();
	    
	    if (r.length > 0)
    	{
    	    var code = r.Code;
    	    if(code === undefined)
	        {
	            res = "Code undefined";
	        }
    	}else{
    	    res = "No results";
    	}
    }catch(e){
        res = e.message;
    }finally{
        return res;
    }
}

try{
 
    var empId = $.request.parameters.get('empId');
    var perfilId = $.request.parameters.get('prfId');
    var userId = $.request.parameters.get('usrId');
    
    if (empId !== undefined && perfilId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
	    
	   // if(validarUsuario(userId, dbname) === "Exists"){
	        query = 'select 	T1."idPerfil" AS "CodigoPerfil", ' +
                		' T1."idMenu" AS "Menu", ' +
                		' T2."descripcion" AS "Descripcion", ' +
                		' T1."accesa" AS "Accesa", ' +
                		' T1."crea" AS "Crea", ' +
                		' T1."edita" AS "Edita", ' +
                		' T1."aprueba" AS "Aprueba", ' +
                		' T1."rechaza" AS "Rechaza", ' +
                		' T1."escogePrecio" AS "SelListaPrecio" ' +
                	' from "SBO_MSS_MOBILE"."PERMISOS" T1 ' +
                	' JOIN "SBO_MSS_MOBILE"."MENU" T2 ON T1."idMenu" = T2."id"' +
                	' WHERE T1."idPerfil" = \'' + perfilId + '\' AND T1."idEmpresa" = ' + empId ;
	        
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
        	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+perfilId+")");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message + " - " + query);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}