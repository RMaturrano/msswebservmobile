$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objError;
var objResult;
var objType;
var objCount = 0;

function obtenerCodigoSocio(clave, database){
    try{
        
        var mQ = 'select "CardCode" from '+database+'."OCRD" where "CardCode" = \'' + 
                    clave + '\' OR "U_MSSM_CLM" = \'' + clave + '\'' ;
    	var mC = $.hdb.getConnection();
    	var mRS = mC.executeQuery(mQ);
    	mC.close();
    	
    	if (mRS.length > 0)
    	{
    	    return mRS[0].CardCode.toString();   
    	}
    }catch(e){
        return clave;
    }
}

function obtenerProyecto(vendedor, database){
    try{
        
        var proyecto = '';
        var mQ = 'select "U_MSSM_PRJ" as "Proyecto" '+
                 '   from '+database+'."@MSSM_CVE" where "Code" = ' + vendedor;
        var mC = $.hdb.getConnection();
    	var mRS = mC.executeQuery(mQ);
    	mC.close();
    	
    	if (mRS.length > 0)
    	{
    	    return mRS[0].Proyecto.toString();   
    	}
    }catch(e){
        return proyecto;
    }
}

function obtenerSerie(vendedor, database){
    try{
        
        var serie = '';
        var mQ = 'select  "U_MSSM_SRI" as "Serie" ' +
                 '   from '+database+'."@MSSM_CVE" where "Code" = ' + vendedor;
        var mC = $.hdb.getConnection();
    	var mRS = mC.executeQuery(mQ);
    	mC.close();
    	
    	if (mRS.length > 0)
    	{
    	    return mRS[0].Serie.toString();   
    	}
    }catch(e){
        return serie;
    }
}

try{
    var id = $.request.parameters.get('id');

	if (id !== undefined)
	{
	    var dbname = functions.GetDataBase(id);
        var query = 'select IFNULL("ClaveMovil",\'\') AS "ClaveMovil" , ' +
                        '    IFNULL("TransaccionMovil",\'\') AS "TransaccionMovil" , ' +
                        '    IFNULL("SocioNegocio",\'\') AS "SocioNegocio" , ' +
                        '    IFNULL("ListaPrecio",\'\') AS "ListaPrecio" , ' +
                        '    IFNULL("CondicionPago",\'\') AS "CondicionPago" ,  ' +
                        '    IFNULL("Indicador",\'\') AS "Indicador" , ' +
                        '    IFNULL("Referencia",\'\') AS "Referencia" , ' +
                        '    IFNULL("FechaContable",\'\') AS "FechaContable" , ' +
                        '    IFNULL("FechaVencimiento",\'\') AS "FechaVencimiento" , ' +
                        '    IFNULL("Moneda",\'\') AS "Moneda" , ' +
                        '    IFNULL("EmpleadoVenta",\'\') AS "EmpleadoVenta" , ' +
                        '	IFNULL(T2.\"SlpName\",\'\') AS \"VendedorNombre\"       ,' + 
                        '    IFNULL("DireccionFiscal",\'\') AS "DireccionFiscal" , ' + 
                        '    IFNULL("DireccionEntrega",\'\') AS "DireccionEntrega" , ' +
                        '    IFNULL("Comentario",\'\') AS "Comentario" , ' +
                        '    IFNULL("Migrado",\'\') AS "Migrado" , ' +
                        '    IFNULL("Actualizado",\'\') AS "Actualizado" , ' +
                        '    IFNULL("Finalizado",\'\') AS "Finalizado" , ' +
                        '    IFNULL("DocEntry",\'\') AS "DocEntry" , ' +
                        '    IFNULL("Mensaje",\'\') AS "Mensaje" ,  ' +
                        '    EMPRESA,' +
                        '    IFNULL("RANGODIRECCION",\'03\') AS "RangoDireccion" ,  ' +
                        '    IFNULL("LATITUD",\'\') AS "Latitud" ,  ' +
                        '    IFNULL("LONGITUD",\'\') AS "Longitud" ,  ' +
                        '    IFNULL("HORA",\'\') AS "Hora",   ' +
                        '    IFNULL("CONECTADO",\'N\') AS "ModoOffLine"   ' +
                    ' from '+Constants.BD_MOBILE+'."ORDR" T0 LEFT JOIN ' + dbname + '.OSLP T2 ' +
                '           ON T0."EmpleadoVenta" = T2."SlpCode" where "Migrado" = \'N\' AND "EMPRESA" = ' + id;
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	if (rs.length > 0)
    	{
    		var salesOrder = "";
    	    var salesOrderLine = "";
    		var mResult = [];
    		var mDetail = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    salesOrder = '{';   
        		salesOrder += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		salesOrder += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
        		salesOrder += '"SocioNegocio": "'+obtenerCodigoSocio(rs[i].SocioNegocio,dbname)+'",';
        		salesOrder += '"ListaPrecio": "'+rs[i].ListaPrecio+'",';
        		salesOrder += '"CondicionPago": "'+rs[i].CondicionPago+'",';
        		salesOrder += '"Indicador": "'+rs[i].Indicador+'",';
        		salesOrder += '"Referencia": "'+rs[i].Referencia+'",';
        		salesOrder += '"FechaContable": "'+rs[i].FechaContable+'",';
        		salesOrder += '"FechaVencimiento": "'+rs[i].FechaVencimiento+'",';
        		salesOrder += '"Moneda": "'+rs[i].Moneda+'",';
        		salesOrder += '"EmpleadoVenta": "'+rs[i].EmpleadoVenta+'",';
        		salesOrder += '"VendedorNombre": "'+rs[i].VendedorNombre+'",';
        		salesOrder += '"DireccionFiscal": "'+rs[i].DireccionFiscal+'",';
        		salesOrder += '"DireccionEntrega": "'+rs[i].DireccionEntrega+'",';
        		salesOrder += '"Comentario": "'+rs[i].Comentario+'",';
        		salesOrder += '"Migrado": "'+rs[i].Migrado+'",';
        		salesOrder += '"Actualizado": "'+rs[i].Actualizado+'",';
        		salesOrder += '"Finalizado": "'+rs[i].Finalizado+'",';
        		salesOrder += '"DocEntry": "'+rs[i].DocEntry+'",';
        		salesOrder += '"Mensaje": "'+rs[i].Mensaje+'",';
        		salesOrder += '"EMPRESA": "'+rs[i].EMPRESA+'",';
        		salesOrder += '"RangoDireccion": "'+rs[i].RangoDireccion+'",';
        		salesOrder += '"Latitud": "'+rs[i].Latitud+'",';
        		salesOrder += '"Longitud": "'+rs[i].Longitud+'",';
        		salesOrder += '"Hora": "'+rs[i].Hora+'",';
        		salesOrder += '"ModoOffLine": "'+rs[i].ModoOffLine+'",';
        		salesOrder += '"Proyecto": "'+obtenerProyecto(rs[i].EmpleadoVenta,dbname)+'",';
        		salesOrder += '"Serie": "'+obtenerSerie(rs[i].EmpleadoVenta,dbname)+'",';
        		
        		mDetail = [];
        		query = ' select  IFNULL("Linea", \'\') AS "Linea", ' + 
        		                ' IFNULL("Articulo", \'\') AS "Articulo", ' + 
        		                ' IFNULL("UnidadMedida", \'-1\') AS "UnidadMedida", ' + 
        		                ' IFNULL("Almacen", \'\') AS "Almacen", ' + 
        		                ' IFNULL("Cantidad", \'\') AS "Cantidad", ' + 
        		                ' IFNULL("ListaPrecio", \'\') AS "ListaPrecio", ' + 
        		                ' IFNULL("PrecioUnitario", \'\') AS "PrecioUnitario", ' + 
        		                ' IFNULL("PorcentajeDescuento", \'\') AS "PorcentajeDescuento", ' + 
        		                ' IFNULL("Impuesto", \'\') AS "Impuesto", ' + 
        		                ' IFNULL("ClaveMovil", \'\') AS "ClaveMovil" ' + 
        		        ' from '+Constants.BD_MOBILE+'."RDR1" where "ClaveMovil" = \'' + rs[i].ClaveMovil.toString() + '\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    salesOrderLine = '{'; 
                		salesOrderLine += '"Linea": "' + rsDet[j].Linea + '",';
                		salesOrderLine += '"Articulo": "' + rsDet[j].Articulo + '",';
                		salesOrderLine += '"UnidadMedida": "' + rsDet[j].UnidadMedida + '",';
                		salesOrderLine += '"Almacen": "' + rsDet[j].Almacen + '",';
                		salesOrderLine += '"Cantidad": "' + rsDet[j].Cantidad + '",';
                		salesOrderLine += '"ListaPrecio": "' + rsDet[j].ListaPrecio + '",';
                		salesOrderLine += '"PrecioUnitario": "' + rsDet[j].PrecioUnitario + '",';
                		salesOrderLine += '"PorcentajeDescuento": "' + rsDet[j].PorcentajeDescuento + '",';
                		salesOrderLine += '"Impuesto": "' + rsDet[j].Impuesto + '",';
                		salesOrderLine += '"ClaveMovil": "' + rs[i].ClaveMovil + '"';
                		salesOrderLine += "}";
                		
                		mDetail.push(salesOrderLine);
            		}
            		
            		salesOrder += '"Lineas": [' + mDetail.join(",") + ']';
        		    salesOrder += "}";
        		    
            	}else{
            	    salesOrder += '"Lineas": []';
        		    salesOrder += "}";
            	}
            	
            	try{
            	    mResult.push(JSON.parse(salesOrder));    
            	}catch(e){
            	    
            	}
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
	objResult = functions.CreateJSONMessage(-9703000, e.message);
	
}finally{
    
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
	
}