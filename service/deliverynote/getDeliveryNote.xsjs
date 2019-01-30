$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;

function obtenerLotes(database, docEntry, lineNum){
    
    var lstLotes = [];
    var lote = '';
    
    try{
        var mQuery = 'SELECT DISTINCT  T3."BatchNum" as "NroLote", ' +
                     '   				T3."Quantity" as "Cantidad", ' +
                     '   				T3."BaseLinNum" as "LineaBase" ' +
                     '   FROM '+database+'.ODLN T0 INNER JOIN '+database+'.DLN1 T2 ON T0."DocEntry" = T2."DocEntry" ' +
                     '   LEFT OUTER JOIN '+database+'.IBT1 T3 ON T0."DocNum" = T3."BaseNum" AND T3."ItemCode" = T2."ItemCode" ' +
                     '   WHERE T0."DocEntry" = '+docEntry+' AND T3."BaseLinNum" = ' + lineNum;
                     
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	if (mRS.length > 0)
    	{
    	    var j;
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    lote = '{'; 
    		    lote += '"Lote": "' + mRS[j].NroLote + '",';
        		lote += '"Cantidad": ' + mRS[j].Cantidad + ',';
        		lote += '"LineaBase": ' + mRS[j].LineaBase;
        		lote += "}";
        		
        		lstLotes.push(lote);
    		}
    	}else{
    	    return '';
    	}
                     
    }catch(e){
        return '';
    }
    
    return lstLotes.join(",");
}

function ObtenerLineas(clave, database){
    
    try {
        
        var mQuery = 'select  T0."LineNum" as "Linea",' +
                    ' T0."ItemCode" as "Articulo", ' +
                      '	 T0."UomCode" as "UnidadMedida", ' +
                      '	 T0."WhsCode" as "Almacen", ' +
                    '	 T0."Quantity" as "Cantidad", ' +
                    '    T0."OpenQty" as "Disponible", ' +
                    '	 -1 as "ListaPrecio", ' +
                    '	 T0."Price" as "PrecioUnitario", ' +
                    '	 T0."DiscPrcnt" as "PorcentajeDescuento", ' +
                    '	 T0."TaxCode" as "Impuesto" ' +
                    ' from '+database+'.DLN1 T0 where T0."DocEntry" = ' + clave;
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mIncomingPaymentLine = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mIncomingPaymentLine = '{'; 
    		    mIncomingPaymentLine += '"Linea": ' + mRS[j].Linea + ',';
        		mIncomingPaymentLine += '"Articulo": "' + mRS[j].Articulo + '",';
        		mIncomingPaymentLine += '"UnidadMedida": "' + mRS[j].UnidadMedida + '",';
        		mIncomingPaymentLine += '"Almacen": "' + mRS[j].Almacen + '",';
        		mIncomingPaymentLine += '"Cantidad": "' + mRS[j].Cantidad + '",';
        		mIncomingPaymentLine += '"Disponible": "' + mRS[j].Disponible + '",';
        		mIncomingPaymentLine += '"ListaPrecio": ' + mRS[j].ListaPrecio + ',';
        		mIncomingPaymentLine += '"PrecioUnitario": "' + mRS[j].PrecioUnitario + '",';
        		mIncomingPaymentLine += '"PorcentajeDescuento": "' + mRS[j].PorcentajeDescuento + '",';
        		mIncomingPaymentLine += '"Impuesto": "' + mRS[j].Impuesto + '",';
        		mIncomingPaymentLine += '"Lotes": [' + obtenerLotes(database,clave, mRS[j].Linea) + ']';
        		mIncomingPaymentLine += "}";
        		
        		mLines.push(mIncomingPaymentLine);
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
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
        var query = 'SELECT \'A\' AS "Tipo", ' +
                        '	T0."DocEntry" AS "Clave", ' +
                        '	T0."DocNum" AS "Numero", ' +
                        '	IFNULL(T0."FolioPref",\'\') || \'-\' || LPAD(IFNULL(T0."FolioNum",0),7, \'0\') AS "Referencia", ' +
                        '	T0."CardCode" AS "SocioNegocio", ' +
                        '	IFNULL(T2."ListNum",-99) AS "ListaPrecio", ' +
                        '	IFNULL(T0."CntctCode",-99) AS "Contacto", ' +
                        '	T0."DocCur" AS "Moneda", ' +
                        '	T0."SlpCode" AS "EmpleadoVenta", ' +
                        '	substring(IFNULL(T0."Comments",\'\'),0,98) AS "Comentario", ' +
                        '	TO_VARCHAR(T0."TaxDate",\'YYYYMMDD\') AS "FechaContable", ' +
                        '	TO_VARCHAR(T0."DocDueDate", \'YYYYMMDD\') AS "FechaVencimiento", ' +
                        '	IFNULL(T0."PayToCode",\'\') AS "DireccionFiscal", ' +
                        '	IFNULL(T0."ShipToCode",\'\') AS "DireccionEntrega", ' +
                        '	T0."GroupNum" AS "CondicionPago", ' +
                        '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                        '	(T0."DocTotal" - T0."VatSum" + T0."DiscSum") AS "SubTotal", ' +
                        '	T0."DiscSum" AS "Descuento", ' +
                        '	T0."VatSum" AS "Impuesto", ' +
                        '	T0."DocTotal" AS "Total", ' +
                        '	(T0."DocTotal"-T0."PaidToDate") AS "Saldo" ' +
                      '  FROM '+dbname+'.ODLN T0  ' +
                      //'  INNER JOIN '+dbname+'.NNM1 T1  ON T0."Series"=T1."Series"  AND T1."BeginStr" IN (\'01\',\'03\') ' +
                      '  INNER JOIN '+dbname+'.OCRD T2 ON T0."CardCode" = T2."CardCode" ' +
                      '  INNER JOIN ' + dbname + '.CRD1 T3 ON T0."ShipToCode" = T3."Address" AND T3."U_MSS_COVE" = \'' +cove+ '\' ' +
                      '         AND T3."CardCode" = T0."CardCode" ' +
                      '  	WHERE T0."DocTotal" <> T0."PaidToDate" ' +
                      '  	AND T0."CANCELED" = \'N\' ' +
                      '  	AND IFNULL(T0."FolioNum",0) <> 0; ';
	        
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
	    
	    if (rs.length > 0)
    	{
    	    var mIncomingPayment = '';
    		var mResult = [];
    		var i;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    			mIncomingPayment = '{';   
    			mIncomingPayment += '"Tipo": "'+rs[i].Tipo+'",';
        		mIncomingPayment += '"Clave": '+rs[i].Clave+',';
        		mIncomingPayment += '"Numero": '+rs[i].Numero+',';
        		mIncomingPayment += '"Referencia": "'+rs[i].Referencia+'",';
        		mIncomingPayment += '"SocioNegocio": "'+rs[i].SocioNegocio+'",';
        		mIncomingPayment += '"ListaPrecio": '+rs[i].ListaPrecio+',';
        		mIncomingPayment += '"Contacto": '+rs[i].Contacto+',';
        		mIncomingPayment += '"Moneda": "'+rs[i].Moneda+'",';
        		mIncomingPayment += '"EmpleadoVenta": "'+rs[i].EmpleadoVenta+'",';
        		mIncomingPayment += '"Comentario": "'+rs[i].Comentario+'",';
        		mIncomingPayment += '"FechaContable": "'+rs[i].FechaContable+'",';
        		mIncomingPayment += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		mIncomingPayment += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		mIncomingPayment += '"DireccionEntrega": "'+rs[i].DireccionEntrega +'",';
        		mIncomingPayment += '"CondicionPago": "'+rs[i].CondicionPago+'",';
        		mIncomingPayment += '"Indicador": "'+rs[i].Indicador+'",';
        		mIncomingPayment += '"SubTotal": "'+rs[i].SubTotal+'",';
        		mIncomingPayment += '"Descuento": "'+rs[i].Descuento+'",';
        		mIncomingPayment += '"Impuesto": "'+rs[i].Impuesto+'",';
        		mIncomingPayment += '"Total": "'+rs[i].Total+'",';
        		mIncomingPayment += '"Saldo": "'+rs[i].Saldo+'",';
        		mIncomingPayment += '"Lineas": [' + ObtenerLineas(rs[i].Clave, dbname) + ']';
        		mIncomingPayment += "}";
        		
        		mResult.push(JSON.parse(mIncomingPayment));
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