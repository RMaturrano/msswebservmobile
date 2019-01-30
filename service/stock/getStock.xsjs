$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

try{
 
    var empId = $.request.parameters.get('empId');
    var usrId = $.request.parameters.get('usrId');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT T1."WhsCode" AS "Almacen", ' +
                    	' T1."ItemCode" AS "Articulo", ' +
                    	' T1."OnHand" AS "Stock", ' +
                    	' T1."IsCommited" AS "Comprometido", ' +
                    	' T1."OnOrder" AS "Solicitado", ' +
                    	' (T1."OnHand" + T1."OnOrder" - T1."IsCommited") AS "Disponible" ' +
                    ' FROM '+dbname+'.OITM T0  ' +
                    ' INNER JOIN '+dbname+'.OITW T1 ON T1."ItemCode" = T0."ItemCode" AND T1."WhsCode" IN (SELECT T10."WhsCode" FROM '+dbname+'.OWHS T10  ' +
                    													' WHERE T10."DropShip" = \'N\' AND T10."WhsCode" <> \'ALM-BONI\') ' +
                    													' AND T1."WhsCode" IN ( select X0."U_MSSM_COD" from '+dbname+'."@MSSM_CV1" X0 ' +
													 					 '              where X0."Code" = '+usrId+')' +
                    ' WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T1."OnHand" > 0;'; 
	        
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
    			mItem += '"Almacen": "'+rs[i].Almacen+'",';
    			mItem += '"Articulo": "'+rs[i].Articulo+'",';
    			mItem += '"Stock": "'+rs[i].Stock+'",';
    			mItem += '"Comprometido": "'+rs[i].Comprometido+'",';
    			mItem += '"Solicitado": "'+rs[i].Solicitado+'",';
        		mItem += '"Disponible": "'+rs[i].Disponible+'"';
        		mItem += "}";
        		
        		mResult.push(JSON.parse(mItem));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objResponse = functions.CreateResponse(objType, objResult, mResult.length);
    	    functions.DisplayJSON(objResponse, objType);
    	    
    	}else{
    	    objType = "MessageError";
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+empId+")");
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