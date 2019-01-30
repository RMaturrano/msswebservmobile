$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

function obtenerAlmacen(database, userCode){

    try{
        var q = 'SELECT COUNT("U_MSSM_COD") as "Almacen" from '+database+'."@MSSM_CV1" ' + 
                'where "Code" = \''+userCode.toString()+'\' AND "U_MSSM_COD" IS NOT NULL ' +
                ' AND "U_MSSM_COD" != \'\'';
        var c = $.hdb.getConnection();
        var r = c.executeQuery(q);
        c.close();
        
        if(r.length > 0){
            var wsQnty = r[0].Almacen;
            
            if(wsQnty !== undefined){
                return wsQnty;
            }else{
                return 0;
            }
        }
        
    }catch(e){
        return 0;
    }
}

try{
 
    var empId = $.request.parameters.get('empId');
    var userId = $.request.parameters.get('uid');
    
    if (empId !== undefined && userId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    var whsQnty = obtenerAlmacen(dbname, userId);
	    
	    if(whsQnty > 0){
	        var query = 'SELECT T0."WhsCode" AS "Codigo", ' +
                    	 '  T0."WhsName" AS "Nombre", ' +
                    	 '  IFNULL("U_MSS_DSC",0) AS "Descuento" ' +
                    'FROM '+dbname+'.OWHS T0  ' +
                    'WHERE T0."DropShip" = \'N\' AND T0."WhsCode" IN ' + 
                    ' (SELECT IFNULL("U_MSSM_COD",\'\') as "Almacen" from '+dbname+'."@MSSM_CV1" ' + 
                    ' where "Code" = \''+userId.toString()+'\') '; 
	        
        	var conn = $.hdb.getConnection();
        	var rs = conn.executeQuery(query);
        	conn.close();
    	    
    	    if (rs.length > 0)
        	{
        	    var mItem = '';
        		var mResult = [];
        		var i;
        		
        		for(i = 0; i < rs.length ; i++)
        		{
        			mItem = '{';   
        			mItem += '"Codigo": "'+rs[i].Codigo+'",';
            		mItem += '"Nombre": "'+rs[i].Nombre+'",';
            		mItem += '"Descuento": "'+rs[i].Descuento+'"';
            		mItem += "}";
            		
            		mResult.push(JSON.parse(mItem));
        		}
        		
        		objType = Constants.SUCCESS_OBJECT_RESPONSE;
        	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
        	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
        	    functions.DisplayJSON(objResponse, objType);
        	    
        	}else{
        	    objType = "MessageError";
        	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados.");
        	    objResponse = functions.CreateResponse(objType, objResult, 0);
        	    functions.DisplayJSON(objResponse, objType);
        	}
	    
	    }else{
	        objType = "MessageError";
        	    objResult = functions.CreateJSONMessage(-102, "El usuario no tiene almacenes asignados - " + userId);
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