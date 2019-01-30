$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var mResult = [];

try{
 
    var empId = $.request.parameters.get('empId');
    
    if (empId !== undefined)
	{
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT   T0."UgpEntry" AS "Codigo", ' +
                        	'	T0."UgpName" AS "Nombre" ' +
                     ' FROM ' + dbname + '.OUGP T0';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var unitMeasureGroup = "";
    	    var unitMeasureGroupDet = "";
    		var mDetail = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    unitMeasureGroup = '{';   
        		unitMeasureGroup += '"Codigo": "'+rs[i].Codigo+'",';
        		unitMeasureGroup += '"Nombre": "'+rs[i].Nombre+'",';
        		
        		query = 'SELECT DISTINCT T1."UomEntry" AS "Codigo", ' +
                    		' T1."UomName" AS "Nombre", ' +
                    		' T0."UgpEntry" AS "GrupoUnidadMedida" ' +
                    ' FROM ' + dbname + '.UGP1 T0   ' +
                    ' INNER JOIN ' + dbname + '.OUOM T1 ON T1."UomEntry" = T0."UomEntry"  ' +
                    ' WHERE T0."UgpEntry" = \''+rs[i].Codigo+ '\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    mDetail = [];
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    unitMeasureGroupDet = '{'; 
                		unitMeasureGroupDet += '"Codigo": "' + rsDet[j].Codigo + '",';
                		unitMeasureGroupDet += '"Nombre": "' + rsDet[j].Nombre + '"';
                		unitMeasureGroupDet += "}";
                		
                		mDetail.push(unitMeasureGroupDet);
            		}
            		
            		unitMeasureGroup += '"Detalles": [' + mDetail.join(",") + ']';
        		    unitMeasureGroup += "}";
        		    
            	}else{
            	    unitMeasureGroup += '"Detalles": []';
        		    unitMeasureGroup += "}";
            	}
            	
            	mResult.push(JSON.parse(unitMeasureGroup));
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