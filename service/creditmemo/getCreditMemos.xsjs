$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

function ObtenerLineas(clave, database, tipo){
    
    try {
        
        var mQuery = '';
        
        if(tipo === 'A'){
            mQuery = 'SELECT ' +
                	'	T0."LineNum" AS "Linea", ' +
                	'	T0."ItemCode" AS "Articulo", ' +
                	'	CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
                	'	T0."WhsCode" AS "Almacen", ' +
                	'	T0."Quantity" AS "Cantidad", ' +
                	'	T0."PriceBefDi" AS "PrecioUnitario", ' +
                	'	T0."DiscPrcnt" AS "PorcentajeDescuento", ' +
                	'	T0."TaxCode" AS "Impuesto" ' +
                	' FROM ' + database + '.RIN1 "T0" ' +
                	'	INNER JOIN ' + database + '.OITM "T2" ON T2."ItemCode" = T0."ItemCode" ' +
                	' where T0."DocEntry" = ' + clave;
        }else{
            mQuery = 'SELECT ' +
                	'	T0."LineNum" AS "Linea", ' +
                	'	T0."ItemCode" AS "Articulo", ' +
                	'	CASE T2."UgpEntry" WHEN -1 THEN -1 ELSE T0."UomEntry" END AS "UnidadMedida", ' +
                	'	T0."WhsCode" AS "Almacen", ' +
                	'	T0."Quantity" AS "Cantidad", ' +
                	'	T0."PriceBefDi" AS "PrecioUnitario", ' +
                	' 	T0."DiscPrcnt" AS "PorcentajeDescuento", ' +
                	'	T0."TaxCode" AS "Impuesto" ' +
                	' FROM ' + database + '.DRF1 "T0" ' +
                	'	INNER JOIN ' + database + '.OITM "T2" ON T2."ItemCode" = T0."ItemCode" ' +
                	' where T0."DocEntry" = ' + clave;
        }
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mPurchaseOrderLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mPurchaseOrderLine = '{'; 
        		mPurchaseOrderLine += '"Linea": ' + mRS[j].Linea + ',';
        		mPurchaseOrderLine += '"Articulo": "' + mRS[j].Articulo + '",';
        		mPurchaseOrderLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
        		mPurchaseOrderLine += '"Almacen": "' + mRS[j].Almacen + '",';
        		mPurchaseOrderLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
        		mPurchaseOrderLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
        		mPurchaseOrderLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
        		mPurchaseOrderLine += '"Impuesto": "' + mRS[j].Impuesto + '"';
        		mPurchaseOrderLine += "}";
        		
        		mLines.push(mPurchaseOrderLine);
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
 
    var empId = $.request.parameters.get('empId');
    var usrId = $.request.parameters.get('usrId');
    
    if (empId !== undefined && usrId !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT     ' +
                          ' 	\'A\' AS "Tipo", ' +
                          '  	T0."DocEntry"  AS "Clave", ' +
                          '  	T0."DocNum"  AS "Numero", ' +
                          '  	IFNULL(T0."NumAtCard",\'\') AS "Referencia", ' +
                          '  	T0."CardCode" AS "SocioNegocio", ' +
                          '  	IFNULL(T2."ListNum", -99) AS "ListaPrecio", ' +
                          '  	IFNULL(T0."CntctCode" ,-99) AS "Contacto", ' +
                          '  	T0."DocCur" AS "Moneda", ' +
                          '  	T0."SlpCode"  AS "EmpleadoVenta", ' +
                          '  	T1."SlpName" || \' - \' || IFNULL(T0."Comments",\'\') AS "Comentario", ' +
                          '  	TO_VARCHAR(T0."DocDate", \'YYYYMMDD\') AS "FechaContable", ' +
                          '  	TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\')  AS "FechaVencimiento", ' +
                          '  	IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", ' +
                          '  	IFNULL(T0."ShipToCode",\'\') AS "DireccionEntrega", ' +
                          '  	T0."GroupNum"  AS "CondicionPago", ' +
                          '  	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                          '  	(T0."DocTotal" - T0."VatSum" + T0."DiscSum")  AS "SubTotal", ' +
                          '  	T0."VatSum"  AS "Impuesto", ' +
                          '  	T0."DocTotal"  AS "Total", ' +
                          '  	IFNULL(T0."U_MSSM_CRM",\'N\') AS "CreadMovil", ' +
                          '  	IFNULL(T0."U_MSSM_CLM",\'\') AS "ClaveMovil", ' +
                          '  	IFNULL(T0."U_MSSM_TRM",\'01\') AS "TransaccionMovil", ' +
                          '  	IFNULL(T0."U_MSSM_MOL",\'\') AS "ModoOffLine", ' +
                          '  	IFNULL(T0."U_MSSM_LAT",\'\') AS "Latitud", ' +
                          '  	IFNULL(T0."U_MSSM_LON",\'\') AS "Longitud", ' +
                          '  	IFNULL(T0."U_MSSM_HOR",\'\') AS "HoraCreacion", ' +
                          '  	IFNULL(T0."U_MSSM_RAN",\'03\') AS "RangoDireccion" ' +
                          '  FROM ' + dbname + '.ORIN "T0"   ' +
                          '  	INNER JOIN ' + dbname + '.OSLP "T1"   ON T1."SlpCode" = T0."SlpCode" ' +
                          '  	inner JOIN ' + dbname + '.OCRD "T2" ON T0."CardCode" = T2."CardCode" ' +
                          '  	WHERE T0."DocStatus" = \'O\'  ' +
                          '  AND T0."DocType" = \'I\' ' +
                          '  AND IFNULL(T0."U_MSSM_CRM",\'N\') = \'Y\' ' +
                          '  AND IFNULL(T0."U_MSSM_TRM",\'01\') <> \'01\' ' +
                        //  '  AND IFNULL(T0."Indicator",\'\') IN (\'01\',\'03\') ' +
                          '  AND T0."SlpCode" <> -1  AND T0."SlpCode"  = '+usrId+' ' +
                          '  	UNION ' +
                          '  SELECT  ' +
                          '  	\'P\' AS "Tipo",   	 ' +
                          '  	T0."DocEntry"  AS "Clave",   	 ' +
                          '  	T0."DocNum"  AS "Numero",   ' +
                          '  	IFNULL(T0."NumAtCard",\'\') AS "Referencia",  ' +
                          '  	T0."CardCode" AS "SocioNegocio",    ' +
                          '  	IFNULL(T2."ListNum", -99) AS "ListaPrecio", ' +
                          '  	IFNULL(T0."CntctCode" ,-99) AS "Contacto",  ' +
                          '  	T0."DocCur" AS "Moneda",    ' +
                          '  	T0."SlpCode"  AS "EmpleadoVenta",' +
                          '  	T1."SlpName" || \' - \' || IFNULL(T0."Comments",\'\') AS "Comentario",' +
                          '  	TO_VARCHAR(T0."DocDate", \'YYYYMMDD\') AS "FechaContable",' +
                          '  	IFNULL(TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\'), TO_VARCHAR(T0."DocDate", \'YYYYMMDD\'))  AS "FechaVencimiento",' +
                          '  	IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", ' +
                          '  	IFNULL(T0."ShipToCode",\'\') AS "DireccionEntrega", ' +
                          '  	T0."GroupNum"  AS "CondicionPago", ' +
                          '  	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                          '  	(T0."DocTotal" - T0."VatSum" + T0."DiscSum")  AS "SubTotal", ' +
                          '  	T0."VatSum"  AS "Impuesto", ' +
                          '  	T0."DocTotal"  AS "Total", ' +
                          '  	IFNULL(T0."U_MSSM_CRM",\'N\') AS "CreadMovil", ' +
                          '  	IFNULL(T0."U_MSSM_CLM",\'\') AS "ClaveMovil", ' +
                          '  	IFNULL(T0."U_MSSM_TRM",\'01\') AS "TransaccionMovil", ' +
                          '  	IFNULL(T0."U_MSSM_MOL",\'\') AS "ModoOffLine", ' +
                          '  	IFNULL(T0."U_MSSM_LAT",\'\') AS "Latitud", ' +
                          '  	IFNULL(T0."U_MSSM_LON",\'\') AS "Longitud", ' +
                          '  	IFNULL(T0."U_MSSM_HOR",\'\') AS "HoraCreacion", ' +
                          '  	IFNULL(T0."U_MSSM_RAN",\'03\') AS "RangoDireccion" ' +
                          '  FROM ' + dbname + '.ODRF "T0"     ' +
                          '  	INNER JOIN ' + dbname + '.OSLP "T1"  ON T1."SlpCode" = T0."SlpCode" ' +
                          '  	inner JOIN ' + dbname + '.OCRD "T2" ON T0."CardCode" = T2."CardCode" ' +
                          '  WHERE T0."ObjType" = \'14\' ' +
                          '  AND T0."DocStatus" = \'O\'  ' +
                          '  AND T0."DocType" = \'I\' ' +
                          '  AND IFNULL(T0."U_MSSM_CRM",\'N\') = \'Y\' ' +
                          '  AND IFNULL(T0."U_MSSM_TRM",\'01\') <> \'01\' ' +
                       //   '  AND IFNULL(T0."Indicator",\'\') IN (\'01\',\'03\') ' +
                          '  --AND CONVERT(NVARCHAR(10),T0."DocDate,112) = CONVERT(NVARCHAR(10),GETDATE(),112) ' +
                          '  AND T0."SlpCode" <> -1  AND T0."SlpCode"  = '+usrId+' ; ';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mPurchaseOrder = '';
    	    var mPurchaseOrderDetail = '';
    		var mResult = [];
    		var mDetail = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mPurchaseOrder = '{';   
    			mPurchaseOrder += '"Tipo": "'+rs[i].Tipo+'",';
        		mPurchaseOrder += '"Clave": '+rs[i].Clave+',';
        		mPurchaseOrder += '"Numero": '+rs[i].Numero+',';
        		mPurchaseOrder += '"Referencia": "'+rs[i].Referencia+'",';
        		mPurchaseOrder += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		mPurchaseOrder += '"ListaPrecio": '+rs[i].ListaPrecio+',';
        		mPurchaseOrder += '"Contacto": '+rs[i].Contacto+',';
        		mPurchaseOrder += '"Moneda": "'+rs[i].Moneda+'",';
        		mPurchaseOrder += '"EmpleadoVenta": '+rs[i].EmpleadoVenta+',';
        		mPurchaseOrder += '"Comentario": "'+rs[i].Comentario+'",';
        		mPurchaseOrder += '"FechaContable": "'+rs[i].FechaContable+'",';
        		mPurchaseOrder += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		mPurchaseOrder += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		mPurchaseOrder += '"DireccionEntrega": "'+rs[i].DireccionEntrega+'",';
        		mPurchaseOrder += '"CondicionPago": '+rs[i].CondicionPago+',';
        		mPurchaseOrder += '"Indicador": "'+rs[i].Indicador+'",';
        		mPurchaseOrder += '"SubTotal": "'+rs[i].SubTotal+'",';
        		mPurchaseOrder += '"Impuesto": "'+rs[i].Impuesto+'",';
        		mPurchaseOrder += '"Total": "'+rs[i].Total+'",';
        		mPurchaseOrder += '"CreadMovil": "'+rs[i].CreadMovil+'",';
        		mPurchaseOrder += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		mPurchaseOrder += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
        		mPurchaseOrder += '"ModoOffLine": "'+rs[i].ModoOffLine+'",';
        		mPurchaseOrder += '"Latitud": "'+rs[i].Latitud+'",';
        		mPurchaseOrder += '"Longitud": "'+rs[i].Longitud+'",';
        		mPurchaseOrder += '"HoraCreacion": "'+rs[i].HoraCreacion+'",';
        		mPurchaseOrder += '"RangoDireccion": "'+rs[i].RangoDireccion+'",';
        		mPurchaseOrder += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname, rs[i].Tipo) + ']';
        		mPurchaseOrder += "}";
        		
        		mResult.push(JSON.parse(mPurchaseOrder));
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