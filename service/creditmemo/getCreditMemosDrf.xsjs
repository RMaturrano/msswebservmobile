$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objError;
var objResult;
var objType;
var objCount = 0;
var query;

function obtenerLotes(ClaveMovil, Linea){
    try{
        
        var mQuery = 'select "CLAVEBASE" as "ClaveBase", "LINEABASE" as "LineaBase", '+
                        ' "LOTE" as "Lote", "CANTIDAD" as "Cantidad" ' +
                        'from '+Constants.BD_MOBILE+'."RIN2" where ' +
                     ' "CLAVEBASE" = \'' + ClaveMovil + '\' AND "LINEABASE" = ' + Linea;
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var k;
    	var mLote = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(k = 0; k < mRS.length ; k++)
    		{
    		    mLote = '{'; 
        		mLote += '"ClaveBase": "' + mRS[k].ClaveBase + '",';
        		mLote += '"LineaBase": ' + mRS[k].LineaBase + ',';
        		mLote += '"Lote": "' + mRS[k].Lote + '",';
        		mLote += '"Cantidad": ' + mRS[k].Cantidad + '';
        		mLote += "}";
        		
        		mLines.push(mLote);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
        return ''; 
    }
}

try{
    var id = $.request.parameters.get('id');

	if (id !== undefined)
	{
	    var dbname = functions.GetDataBase(id);
        query = 'select IFNULL("CLAVEMOVIL",\'\') AS "ClaveMovil" , ' +
                        '    IFNULL("CLAVEBASE",\'\') AS "ClaveBase" , ' +
                        '    IFNULL("SOCIONEGOCIO",\'\') AS "SocioNegocio" , ' +
                        '    IFNULL("LISTAPRECIO",\'\') AS "ListaPrecio" , ' +
                        '    IFNULL("CONDICIONPAGO",\'\') AS "CondicionPago" ,  ' +
                        '    IFNULL("INDICADOR",\'\') AS "Indicador" , ' +
                        '    IFNULL("REFERENCIA",\'\') AS "Referencia" , ' +
                        '    IFNULL("FECHACONTABLE",\'\') AS "FechaContable" , ' +
                        '    IFNULL("FECHAVENCIMIENTO",\'\') AS "FechaVencimiento" , ' +
                        '    IFNULL("MONEDA",\'\') AS "Moneda" , ' +
                        '    IFNULL("EMPLEADOVENTA",\'\') AS "EmpleadoVenta" , ' +
                        '	IFNULL(T2.\"SlpName\",\'\') AS \"VendedorNombre\"       ,' + 
                        '    IFNULL("DIRECCIONFISCAL",\'\') AS "DireccionFiscal" , ' + 
                        '    IFNULL("DIRECCIONENTREGA",\'\') AS "DireccionEntrega" , ' +
                        '    IFNULL("COMENTARIO",\'\') AS "Comentario" , ' +
                        '    IFNULL("MIGRADO",\'N\') AS "Migrado" , ' +
                        '    IFNULL("DOCENTRY",\'\') AS "DocEntry" , ' +
                        '    IFNULL("MENSAJE",\'\') AS "Mensaje" , ' +
                        '    IFNULL("LATITUD",\'\') AS "Latitud" , ' +
                        '    IFNULL("LONGITUD",\'\') AS "Longitud" , ' +
                        '    IFNULL("HORACREACION",\'\') AS "HoraCreacion" , ' +
                        '    IFNULL("MODOOFFLINE",\'\') AS "ModoOffline" , ' +
                        '    IFNULL("EMPRESA",-1) AS "EMPRESA"  ' +
                    ' from '+Constants.BD_MOBILE+'."ORIN" T0 LEFT JOIN ' + dbname + '.OSLP T2 ' +
                '           ON T0."EMPLEADOVENTA" = T2."SlpCode" where "MIGRADO" = \'N\' AND "EMPRESA" = ' + id;
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	if (rs.length > 0)
    	{
    		var returnDoc = "";
    	    var returnDocLine = "";
    		var mResult = [];
    		var mDetail = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    returnDoc = '{';   
        		returnDoc += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		returnDoc += '"ClaveBase": "'+rs[i].ClaveBase+'",';
        		returnDoc += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		returnDoc += '"ListaPrecio": "'+rs[i].ListaPrecio+'",';
        		returnDoc += '"CondicionPago": "'+rs[i].CondicionPago+'",';
        		returnDoc += '"Indicador": "'+rs[i].Indicador+'",';
        		returnDoc += '"Referencia": "'+rs[i].Referencia+'",';
        		returnDoc += '"FechaContable": "'+rs[i].FechaContable+'",';
        		returnDoc += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		returnDoc += '"Moneda": "'+rs[i].Moneda+'",';
        		returnDoc += '"EmpleadoVenta": "'+rs[i].EmpleadoVenta+'",';
        		returnDoc += '"VendedorNombre": "'+rs[i].VendedorNombre+'",';
        		returnDoc += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		returnDoc += '"DireccionEntrega": "'+rs[i].DireccionEntrega+'",';
        		returnDoc += '"Comentario": "'+rs[i].Comentario+'",';
        		returnDoc += '"Migrado": "'+rs[i].Migrado+'",';
        		returnDoc += '"DocEntry": "'+rs[i].DocEntry+'",';
        		returnDoc += '"Mensaje": "'+rs[i].Mensaje+'",';
        		returnDoc += '"Latitud": "'+rs[i].Latitud+'",';
        		returnDoc += '"Longitud": "'+rs[i].Longitud+'",';
        		returnDoc += '"HoraCreacion": "'+rs[i].HoraCreacion+'",';
        		returnDoc += '"ModoOffline": "'+rs[i].ModoOffline+'",';
        		returnDoc += '"EMPRESA": "'+rs[i].EMPRESA+'",';
        		
        		mDetail = [];
        		query = ' select   ' + 
        		                ' IFNULL("LINEA", -1) AS "Linea", ' + 
        		                ' IFNULL("ARTICULO", \'\') AS "Articulo", ' + 
        		                ' IFNULL("UNIDADMEDIDA", \'\') AS "UnidadMedida", ' + 
        		                ' IFNULL("ALMACEN", \'\') AS "Almacen", ' + 
        		                ' IFNULL("CANTIDAD", \'\') AS "Cantidad", ' + 
        		                ' IFNULL("LISTAPRECIO", \'\') AS "ListaPrecio", ' + 
        		                ' IFNULL("PRECIOUNITARIO", \'0\') AS "PrecioUnitario", ' + 
        		                ' IFNULL("PORCENTAJEDESCUENTO", \'0\') AS "PorcentajeDescuento", ' + 
        		                ' IFNULL("IMPUESTO", \'\') AS "Impuesto", ' + 
        		                ' IFNULL("CLAVEMOVIL", \'\') AS "ClaveMovil", ' + 
        		                ' IFNULL("LINEABASE", \'\') AS "LineaBase" ' + 
        		        ' from '+Constants.BD_MOBILE+'."RIN1" where "CLAVEMOVIL" = \'' + rs[i].ClaveMovil + '\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    returnDocLine = '{'; 
            		    returnDocLine += '"Linea": ' + rsDet[j].Linea + ',';
                		returnDocLine += '"Articulo": "' + rsDet[j].Articulo + '",';
                		returnDocLine += '"UnidadMedida": "' + rsDet[j].UnidadMedida + '",';
                		returnDocLine += '"Almacen": "' + rsDet[j].Almacen + '",';
                		returnDocLine += '"Cantidad": "' + rsDet[j].Cantidad + '",';
                		returnDocLine += '"ListaPrecio": "' + rsDet[j].ListaPrecio + '",';
                		returnDocLine += '"PrecioUnitario": "' + rsDet[j].PrecioUnitario + '",';
                		returnDocLine += '"PorcentajeDescuento": "' + rsDet[j].PorcentajeDescuento + '",';
                		returnDocLine += '"Impuesto": "' + rsDet[j].Impuesto + '",';
                		returnDocLine += '"ClaveMovil": "' + rsDet[j].ClaveMovil + '",';
                		returnDocLine += '"LineaBase": "' + rsDet[j].LineaBase + '",';
                		returnDocLine += '"Lotes": [' + obtenerLotes(rs[i].ClaveMovil, rsDet[j].Linea) + ']';
                		returnDocLine += "}";
                		
                		mDetail.push(returnDocLine);
            		}
            		
            		returnDoc += '"Lineas": [' + mDetail.join(",") + ']';
        		    returnDoc += "}";
        		    
            	}else{
            	    returnDoc += '"Lineas": []';
        		    returnDoc += "}";
            	}
            	
            	mResult.push(JSON.parse(returnDoc));
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
    	    objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
    	    objCount = mResult.length;
    		
    	}else{
    	    objType = Constants.ERROR_MESSAGE_RESPONSE;
    	    objResult = functions.CreateJSONMessage(-101, "No se han encontrado registros con los parámetros indicados. ("+id+")");
    	}
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResult = functions.CreateJSONMessage(-100, "No se han recibido los parámetros de entrada.");
	}

}catch(e){
    
    objType = Constants.ERROR_MESSAGE_RESPONSE;
	objResult = functions.CreateJSONMessage(-9703000, e.message + ' ' +query);
	
}finally{
    
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
	
}