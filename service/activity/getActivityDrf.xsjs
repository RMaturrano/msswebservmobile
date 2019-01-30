$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var functions = $.MSS_MOBILE.Functions;
var Constants = $.MSS_MOBILE.Constants;
var objResponse;
var objError;
var objResult;
var objType;
var objCount = 0;

var id;
var query;
var activity;

function obtenerIdDireccion(database, codigoDir, codigoCli){
    
    var res = '';
    
    try{
        var mQuery = 'SELECT "AdresType" from '+database+'.CRD1 where "CardCode" = \''+
                            codigoCli+'\' and "Address" = \''+codigoDir+'\' ';
                     
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	if (mRS.length > 0)
    	{
    	    res = mRS[0].AdresType;
    	}else{
    	    return '';
    	}
                     
    }catch(e){
        return '';
    }
    
    return res;
}

function obtenerClaveFactura(database, folioPref, folioNum, cliente){
    var res = -1;
    try{
        var mQuery = 'SELECT IFNULL("DocEntry", -1) AS "DocEntry" FROM '+database+'.OINV WHERE "FolioPref" = \''+folioPref+'\' '  +
                    ' AND "FolioNum" = '+folioNum+' and "CardCode" = \''+cliente+'\'';
                    
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	if (mRS.length > 0)
    	{
    	    res = mRS[0].DocEntry;
    	}else{
    	    return -1;
    	}
    }catch(e){
        return -1;
    }
    return res;
}
try{
    id = $.request.parameters.get('id');
    var dbname = functions.GetDataBase(id);
    var directorioSAP = functions.GetDirectorioSAP(dbname);
    var directorioPath = '';
    
     if(directorioSAP !== 'null' && directorioSAP !== null){
        directorioSAP += 'FOTO_INCIDENCIA_' + dbname + '\\';
        directorioPath = 'FOTO_INCIDENCIA_' + dbname + "\\";
    }
   
	if (id !== undefined)
	{
        query = ' select        ' + 
                       	'	T0.\"CLAVEMOVIL\" AS \"ClaveMovil\", ' + 
                    	'	T0.\"ORIGEN\" AS \"Origen\"         ,' + 
                    	'	T0.\"CODIGOCLIENTE\" AS \"CodigoCliente\"  ,' + 
                    	'	T0.\"CODIGOCONTACTO\" AS \"CodigoContacto\" ,' + 
                    	'	T0.\"CODIGODIRECCION\" AS \"CodigoDireccion\",' + 
                    	'	T0.\"CODIGOMOTIVO\" AS \"CodigoMotivo\"   ,' + 
                    	'	T1.\"DESCRIPCION\" AS \"DescripcionMotivo\"   ,' + 
                    	'	T0.\"COMENTARIOS\" AS \"Comentarios\"    ,' + 
                    	'	T0.\"VENDEDOR\" AS \"Vendedor\"       ,' + 
                    	'	IFNULL(T2.\"SlpName\",\'\') AS \"VendedorNombre\"       ,' + 
                    	'	T0.\"LATITUD\" AS \"Latitud\"        ,' + 
                    	'	T0.\"LONGITUD\" AS \"Longitud\"       ,' + 
                    	'	T0.\"FECHACREACION\" AS \"FechaCreacion\"  ,' + 
                    	'	T0.\"HORACREACION\" AS \"HoraCreacion\"   ,' + 
                    	'	T0.\"MODOOFFLINE\" AS \"ModoOffLine\"    ,' + 
                    	'	IFNULL(TO_INT(T0.\"CLAVEFACTURA\"), -1) AS \"ClaveFactura\"   ,' + 
                    	'	T0.\"SERIEFACTURA\" AS \"SerieFactura\"   ,' + 
                    	'	T0.\"CORRELATIVOFACTURA\" AS \"CorrelativoFactura\",' + 
                    	'	CASE WHEN T0.\"TIPOINCIDENCIA\" = \'01\' THEN \'Parcialmente rechazado\' ' +
                    	'           ELSE \'Totalmente rechazado\' END AS \"TipoIncidencia\" ,' + 
                    	'	T0.\"FECHAPAGO\" AS \"FechaPago\"      ,' + 
                    	'	T0.\"MIGRADO\" AS \"Migrado\"        ,' + 
                    	'	T0.\"ACTUALIZADO\" AS \"Actualizado\"    ,' + 
                    	'	T0.\"FINALIZADO\" AS \"Finalizado\"     ,' + 
                    	'	T0.\"CODIGOSAP\" AS \"CodigoSAP\"      ,' + 
                    	'	T0.\"MENSAJE\" AS \"Mensaje\"        ,' + 
                    	'	IFNULL(T0.\"RANGODIRECCION\", \'03\') AS \"Rango\"        ,' + 
                    	'	T0.\"EMPRESA\",        ' +   
                    	'	IFNULL(TO_NVARCHAR(T0.\"FOTO64\"),\'\') AS \"FOTO64\" ' + 
                '    from '+Constants.BD_MOBILE+'.OCLG T0 LEFT JOIN ' + Constants.BD_MOBILE + '.MOTIVOS T1 ' +
                '           on T0.CODIGOMOTIVO = T1."ID" LEFT JOIN ' + dbname + '.OSLP T2 ' +
                '           ON T0."VENDEDOR" = T2."SlpCode" '+
                '   where "EMPRESA" = ' + id.toString() + ' AND T0.\"MIGRADO\" = \'N\'';

    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	if (rs.length > 0)
    	{
    	        var mResult = [];
        		var i;
        		
        		
        		for(i = 0; i < rs.length ; i++)
        		{
        		    activity = {};
        		    activity.ClaveMovil = rs[i].ClaveMovil;
        		    activity.Origen = rs[i].Origen;
        		    activity.CodigoCliente = rs[i].CodigoCliente;
        		    activity.CodigoContacto = rs[i].CodigoContacto;
        		    activity.TipoDireccion = obtenerIdDireccion(dbname, rs[i].CodigoDireccion, rs[i].CodigoCliente);
        		    activity.CodigoDireccion = rs[i].CodigoDireccion;
        		    activity.CodigoMotivo = rs[i].CodigoMotivo;
        		    activity.DescripcionMotivo = rs[i].DescripcionMotivo;
        		    activity.Comentarios = rs[i].Comentarios;
        		    activity.Vendedor = rs[i].Vendedor;
        		    activity.VendedorNombre = rs[i].VendedorNombre;
        		    activity.Latitud = rs[i].Latitud;
        		    activity.Longitud = rs[i].Longitud;
        		    activity.FechaCreacion = rs[i].FechaCreacion;
        		    activity.HoraCreacion = rs[i].HoraCreacion;
        		    activity.ModoOffLine = rs[i].ModoOffLine;
        		    
        		    if(rs[i].ClaveFactura < 0 && rs[i].CorrelativoFactura !== -1){
        		        activity.ClaveFactura = obtenerClaveFactura(dbname, rs[i].SerieFactura, 
        		                                                rs[i].CorrelativoFactura, rs[i].CodigoCliente);
        		    }else{
        		        activity.ClaveFactura = rs[i].ClaveFactura;    
        		    }
        		    
        		    activity.SerieFactura = rs[i].SerieFactura;
        		    activity.CorrelativoFactura = rs[i].CorrelativoFactura;
        		    activity.TipoIncidencia = rs[i].TipoIncidencia;
        		    activity.FechaPago = rs[i].FechaPago;
        		    activity.Migrado = rs[i].Migrado;
        		    activity.Actualizado = rs[i].Actualizado;
        		    activity.Finalizado = rs[i].Finalizado;
        		    activity.CodigoSAP = rs[i].CodigoSAP;
        		    activity.Mensaje = rs[i].Mensaje;
        		    activity.Rango = rs[i].Rango;
        		    activity.EMPRESA = rs[i].EMPRESA;
        		    activity.U_MSSM_IMG = directorioPath + rs[i].ClaveMovil+'.jpg';
        		    activity.Directorio = directorioSAP;
        		    activity.Foto64 = rs[i].FOTO64;
                	mResult.push(activity);
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