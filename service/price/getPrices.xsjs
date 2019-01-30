$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT T0."PriceList" AS "ListaPrecio", ' +
                        	'T0."ItemCode" AS "Articulo", ' +
                        	'T2."PrimCurr" AS "Moneda", ' +
                        	'T0."Price" AS "PrecioVenta" ' +
                        'FROM '+dbname+'.ITM1 T0 ' +
                        'INNER JOIN '+dbname+'.OITM T1 ON T1."ItemCode" = T0."ItemCode" AND T1."validFor" = \'Y\'  ' +
                        '					AND T1."frozenFor" = \'N\' AND T1."SellItem" = \'Y\' ' +
                        'INNER JOIN '+dbname+'.OPLN T2 ON T2."ListNum" = T0."PriceList" AND T2."ValidFor" = \'Y\' ' +
                        'WHERE T0."Price" > 0; '; 
	        
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
    			mItem += '"ListaPrecio": "'+rs[i].ListaPrecio+'",';
    			mItem += '"Articulo": "'+rs[i].Articulo+'",';
    			mItem += '"Moneda": "'+rs[i].Moneda+'",';
    			mItem += '"PrecioVenta": "'+rs[i].PrecioVenta+'"';
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