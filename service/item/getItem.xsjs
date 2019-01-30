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
        var query = 'SELECT T0."ItemCode" AS "Codigo", ' +
                    '	T0."ItemName" AS "Nombre", ' +
                    '	T0."FirmCode"  AS "Fabricante", ' +
                    '	T0."ItmsGrpCod" AS "GrupoArticulo", ' +
                    '	T0."UgpEntry" AS "GrupoUnidadMedida", ' +
                    '   IFNULL(T0."CodeBars", \'\') AS "CodigoBarras",' +
                    '   IFNULL(T0."DfltWH",\'\') AS "AlmacenDefecto", '+
                    '   IFNULL(T0."U_MSS_MUES",\'N\') AS "ArticuloMuestra", '+
                    '	IFNULL(CASE T0."UgpEntry" WHEN -1 THEN (SELECT T10."UomEntry" FROM '+dbname+'.OUOM T10  ' +
                    '	WHERE T10."UomName" = T0."SalUnitMsr") ELSE T0."SUoMEntry" END,-99)  AS "UnidadMedidaVenta" ' +
                   ' FROM '+dbname+'.OITM T0  ' +
                   ' WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\' AND T0."ItemType" = \'I\'  ';
                   //' 		AND (T0."SalUnitMsr" IS NOT NULL OR T0."SUoMEntry" IS NOT NULL);'; 
                   
       /* //YAMBOLY => utilizar tabla de usuario SUB FAMILIA en lugar de GRUPOS DE ARTICULO
        var query = 'SELECT T0."ItemCode" AS "Codigo", ' +
                    '	T0."ItemName" AS "Nombre", ' +
                    '	T0."FirmCode"  AS "Fabricante", ' +
                    '	T1."Code" AS "GrupoArticulo", ' +
                    '	T0."UgpEntry" AS "GrupoUnidadMedida", ' +
                    '	IFNULL(CASE T0."UgpEntry" WHEN -1 THEN (SELECT T10."UomEntry" FROM '+dbname+'.OUOM T10  ' +
                    '	WHERE T10."UomName" = T0."SalUnitMsr") ELSE T0."SUoMEntry" END,-99)  AS "UnidadMedidaVenta" ' +
                   ' FROM '+dbname+'.OITM T0  JOIN ' + dbname + '."@MSS_SFAM" T1 ' +
                   '                ON T0."U_MSS_COSF" = T1."Code" ' +
                   ' WHERE T0."validFor" = \'Y\' AND T0."frozenFor" = \'N\' AND T0."SellItem" = \'Y\'  ' +
                   ' 		AND (T0."SalUnitMsr" IS NOT NULL OR T0."SUoMEntry" IS NOT NULL);';  */
	        
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
    		    try{
    		        mItem = '{';   
        			mItem += '"Codigo": "'+rs[i].Codigo+'",';
            		mItem += '"Nombre": "'+rs[i].Nombre+'",';
            		mItem += '"Fabricante": "'+rs[i].Fabricante+'",';
            		mItem += '"GrupoArticulo": "'+rs[i].GrupoArticulo+'",';
            		mItem += '"GrupoUnidadMedida": "'+rs[i].GrupoUnidadMedida+'",';
            		mItem += '"UnidadMedidaVenta": "'+rs[i].UnidadMedidaVenta+'",';
            		mItem += '"AlmacenDefecto": "'+rs[i].AlmacenDefecto+'",';
            		mItem += '"ArticuloMuestra": "'+rs[i].ArticuloMuestra+'",';
            		mItem += '"CodigoBarras": "'+rs[i].CodigoBarras+'"';
            		mItem += "}";
        		
        		    mResult.push(JSON.parse(mItem));
        		    
    		    }catch(e){
    		        
    		    }
    			
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