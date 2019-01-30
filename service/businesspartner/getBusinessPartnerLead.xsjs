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
var migrado;
var query;
var businessPartner;

try{
    id = $.request.parameters.get('id');
    migrado = $.request.parameters.get('mig');

	if (id !== undefined)
	{
	    var qwhere = '';
	    
	    if(migrado !== undefined && migrado !== ''){
	        migrado = ' AND "Migrado" = \''+migrado+'\'';
	    }
	    
	    var dbname = functions.GetDataBase(id);
        var query = 'select IFNULL("ClaveMovil",\'\') AS "ClaveMovil" , ' +
                        '    IFNULL("TransaccionMovil",\'\') AS "TransaccionMovil" , ' +
                        '    IFNULL("TipoPersona",\'\') AS "TipoPersona" , ' +
                        '    IFNULL("TipoDocumento",\'\') AS "TipoDocumento" , ' +
                        '    IFNULL("NumeroDocumento",\'\') AS "NumeroDocumento" ,  ' +
                        //'    IFNULL(RTRIM(LTRIM("NombreRazonSocial")),\'\') AS "NombreRazonSocial" , ' +
                        '    IFNULL(UPPER(RTRIM(LTRIM("NombreRazonSocial"))),\'\') AS "NombreRazonSocial" , ' +
                        '    IFNULL(UPPER("NombreComercial"),\'\') AS "NombreComercial" , ' +
                        '    IFNULL(UPPER("ApellidoPaterno"),\'\') AS "ApellidoPaterno" , ' +
                        '    IFNULL(UPPER("ApellidoMaterno"),\'\') AS "ApellidoMaterno" , ' +
                        '    IFNULL(UPPER("PrimerNombre"),\'\') AS "PrimerNombre" , ' +
                        '    IFNULL(UPPER("SegundoNombre"),\'\') AS "SegundoNombre" , ' +
                        '    IFNULL("Telefono1",\'\') AS "Telefono1" , ' + 
                        '    IFNULL("Telefono2",\'\') AS "Telefono2" , ' +
                        '    IFNULL("TelefonoMovil",\'\') AS "TelefonoMovil" , ' +
                        '    IFNULL("CorreoElectronico",\'\') AS "CorreoElectronico" , ' +
                        '    IFNULL("GrupoSocio",-1) AS "GrupoSocio" , ' +
                        '    IFNULL("ListaPrecio",-1) AS "ListaPrecio" , ' +
                        '    IFNULL("CondicionPago",-1) AS "CondicionPago" , ' +
                        '    IFNULL("Indicador",\'\') AS "Indicador" , ' +
                        '    IFNULL("Zona",\'\') AS "Zona" , ' +
                        '    IFNULL("Migrado",\'\') AS "Migrado" ,  ' +
                        '    IFNULL("Actualizado",\'\') AS "Actualizado" ,  ' +
                        '    IFNULL("Finalizado",\'\') AS "Finalizado" ,  ' +
                        '    IFNULL("POSEEACTIVOS",\'\') AS "POSEEACTIVOS" ,  ' +
                        '    IFNULL("VENDEDOR",\'\') AS "VENDEDOR" ,  ' +
                        '	 IFNULL(T2.\"SlpName\",\'\') AS \"VendedorNombre\"       ,' + 
                        '    IFNULL("MENSAJE",\'\') AS "MENSAJE" ,  ' +
                        '    IFNULL("CARDCODE",\'\') AS "CARDCODE",  ' +
                        '    "EMPRESA", ' +
                        '    IFNULL("PROYECTO",\'\') AS "PROYECTO", ' +
                        '    IFNULL("TIPOREGISTRO",\'01\') AS "TipoRegistro" ' +
                    ' from '+Constants.BD_MOBILE+'."OCRD" T1 LEFT JOIN ' + dbname + '.OSLP T2 ' +
                '           ON T1."VENDEDOR" = T2."SlpCode" where "EMPRESA" = ' + id.toString() + qwhere.toString();
    	var conn = $.hdb.getConnection();
    	var rs = conn.executeQuery(query);
    	conn.close();
    	
    	if (rs.length > 0)
    	{
    		businessPartner = "";
    	    var businessPartnerContacts = "";
    	    var businessPartnerDirections = "";
    		var mResult = [];
    		var mDetailContacts = [];
    		var mDetailDirections = [];
    		var i;
    		var j;
    		
    		for(i = 0; i < rs.length ; i++)
    		{
    		    businessPartner = '{';   
        		businessPartner += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
        		businessPartner += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
        		businessPartner += '"TipoPersona": "'+rs[i].TipoPersona+'",';
        		businessPartner += '"TipoDocumento": "'+rs[i].TipoDocumento+'",';
        		businessPartner += '"NumeroDocumento": "'+functions.ReplaceInvalidChars(rs[i].NumeroDocumento)+'",';
        		businessPartner += '"NombreRazonSocial": "'+functions.ReplaceInvalidChars(rs[i].NombreRazonSocial)+'",';
        		businessPartner += '"NombreComercial": "'+functions.ReplaceInvalidChars(rs[i].NombreComercial)+'",';
        		businessPartner += '"ApellidoPaterno": "'+rs[i].ApellidoPaterno+'",';
        		businessPartner += '"ApellidoMaterno": "'+rs[i].ApellidoMaterno+'",';
        		businessPartner += '"PrimerNombre": "'+rs[i].PrimerNombre+'",';
        		businessPartner += '"SegundoNombre": "'+rs[i].SegundoNombre+'",';
        		businessPartner += '"Telefono1": "'+functions.ReplaceInvalidChars(rs[i].Telefono1)+'",';
        		businessPartner += '"Telefono2": "'+rs[i].Telefono2+'",';
        		businessPartner += '"TelefonoMovil": "'+rs[i].TelefonoMovil+'",';
        		businessPartner += '"CorreoElectronico": "'+functions.CleanChars(rs[i].CorreoElectronico)+'",';
        		businessPartner += '"ListaPrecio": '+rs[i].ListaPrecio+',';
        		businessPartner += '"GrupoSocio": '+rs[i].GrupoSocio+',';
        		businessPartner += '"CondicionPago": '+rs[i].CondicionPago+',';
        		businessPartner += '"Indicador": "'+rs[i].Indicador+'",';
        		businessPartner += '"Zona": "'+rs[i].Zona+'",';
        		businessPartner += '"Migrado": "'+rs[i].Migrado+'",';
        		businessPartner += '"Actualizado": "'+rs[i].Actualizado+'",';
        		businessPartner += '"Finalizado": "'+rs[i].Finalizado+'",';
        		businessPartner += '"POSEEACTIVOS": "'+rs[i].POSEEACTIVOS+'",';
        		businessPartner += '"VENDEDOR": "'+rs[i].VENDEDOR+'",';
        		businessPartner += '"VendedorNombre": "'+rs[i].VendedorNombre+'",';
        		businessPartner += '"MENSAJE": "'+rs[i].MENSAJE+'",';
        		businessPartner += '"CARDCODE": "'+rs[i].CARDCODE+'",';
        		businessPartner += '"EMPRESA": "'+rs[i].EMPRESA+'",';
        		businessPartner += '"PROYECTO": "'+rs[i].PROYECTO+'",';
        		businessPartner += '"TipoRegistro": "'+rs[i].TipoRegistro+'",';
        		
        		//Contactos
        		mDetailContacts = [];
        		query = ' select  IFNULL("IdContacto", \'\') AS "IdContacto", ' + 
        		                ' IFNULL("PrimerNombre", \'\') AS "PrimerNombre", ' + 
        		                ' IFNULL("SegundoNombre", \'\') AS "SegundoNombre", ' + 
        		                ' IFNULL("Apellidos", \'\') AS "Apellidos", ' + 
        		                ' IFNULL("Posicion", \'\') AS "Posicion", ' + 
        		                ' IFNULL("Direccion", \'\') AS "Direccion", ' + 
        		                ' IFNULL("CorreoElectronico", \'\') AS "CorreoElectronico", ' + 
        		                ' IFNULL("Telefono1", \'\') AS "Telefono1", ' + 
        		                ' IFNULL("Telefono2", \'\') AS "Telefono2", ' + 
        		                ' IFNULL("TelefonoMovil", \'\') AS "TelefonoMovil" ' + 
        		        ' from '+Constants.BD_MOBILE+'."CRD1" where "ClaveMovil" = \'' + rs[i].ClaveMovil + '\'';
	        
            	conn = $.hdb.getConnection();
            	var rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    businessPartnerContacts = '{'; 
                		businessPartnerContacts += '"IdContacto": "' + functions.ReplaceInvalidChars(rsDet[j].IdContacto) + '",';
                		businessPartnerContacts += '"PrimerNombre": "' + functions.ReplaceInvalidChars(rsDet[j].PrimerNombre) + '",';
                		businessPartnerContacts += '"SegundoNombre": "' + functions.ReplaceInvalidChars(rsDet[j].SegundoNombre) + '",';
                		businessPartnerContacts += '"Apellidos": "' + functions.ReplaceInvalidChars(rsDet[j].Apellidos) + '",';
                		businessPartnerContacts += '"Posicion": "' + rsDet[j].Posicion + '",';
                		businessPartnerContacts += '"Direccion": "' + functions.ReplaceInvalidChars(rsDet[j].Direccion) + '",';
                		businessPartnerContacts += '"CorreoElectronico": "' + functions.CleanChars(rsDet[j].CorreoElectronico) + '",';
                		businessPartnerContacts += '"Telefono1": "' + rsDet[j].Telefono1 + '",';
                		businessPartnerContacts += '"Telefono2": "' + rsDet[j].Telefono2 + '",';
                		businessPartnerContacts += '"TelefonoMovil": "' + functions.ReplaceInvalidChars(rsDet[j].TelefonoMovil) + '"';
                		businessPartnerContacts += "}";
                		
                		mDetailContacts.push(businessPartnerContacts);
            		}
            		
            		businessPartner += '"Contacts": [' + mDetailContacts.join(",") + '],';
        		    
            	}else{
            	    businessPartner += '"Contacts": [],';
            	}
            	
            	//Direcciones
            	mDetailDirections = [];
            	query = ' select  IFNULL("Tipo", \'\') AS "Tipo", ' + 
        		                ' IFNULL("Codigo", \'\') AS "Codigo", ' + 
        		                ' IFNULL("Pais", \'\') AS "Pais", ' + 
        		                ' IFNULL("Departamento", \'\') AS "Departamento", ' + 
        		                ' IFNULL("Provincia", \'\') AS "Provincia", ' + 
        		                ' IFNULL("Distrito", \'\') AS "Distrito", ' + 
        		                ' IFNULL("Calle", \'\') AS "Calle", ' + 
        		                ' IFNULL("Referencia", \'\') AS "Referencia", ' + 
        		                ' IFNULL("LATITUD", \'\') AS "Latitud", ' + 
        		                ' IFNULL("LONGITUD", \'\') AS "Longitud", ' + 
        		                ' IFNULL("RUTA", \'\') AS "Ruta", ' + 
        		                ' IFNULL("ZONA", \'\') AS "Zona", ' + 
        		                ' IFNULL("CANAL", \'\') AS "Canal", ' + 
        		                ' IFNULL("GIRO", \'\') AS "Giro" ' + 
        		        ' from '+Constants.BD_MOBILE+'."CRD2" where "ClaveMovil" = \'' + rs[i].ClaveMovil + '\'';
	        
            	conn = $.hdb.getConnection();
            	rsDet = conn.executeQuery(query);
            	conn.close();
        		
        		if (rsDet.length > 0)
            	{
            	    j = 0;
            	    for(j = 0; j < rsDet.length ; j++)
            		{
            		    businessPartnerDirections = '{'; 
                		businessPartnerDirections += '"Tipo": "' + rsDet[j].Tipo + '",';
                		businessPartnerDirections += '"Codigo": "' + rsDet[j].Codigo + '",';
                		businessPartnerDirections += '"Pais": "' + rsDet[j].Pais + '",';
                		businessPartnerDirections += '"Departamento": "' + rsDet[j].Departamento + '",';
                		businessPartnerDirections += '"Provincia": "' + rsDet[j].Provincia + '",';
                		businessPartnerDirections += '"Distrito": "' + rsDet[j].Distrito + '",';
                		businessPartnerDirections += '"Calle": "' + functions.ReplaceInvalidChars(rsDet[j].Calle) + '",';
                		businessPartnerDirections += '"Referencia": "' + functions.ReplaceInvalidChars(rsDet[j].Referencia) + '",';
                		businessPartnerDirections += '"Latitud": "' + rsDet[j].Latitud + '",';
                		businessPartnerDirections += '"Longitud": "' + rsDet[j].Longitud + '",';
                		businessPartnerDirections += '"Ruta": "' + rsDet[j].Ruta + '",';
                		businessPartnerDirections += '"Zona": "' + rsDet[j].Zona + '",';
                		businessPartnerDirections += '"Canal": "' + rsDet[j].Canal + '",';
                		businessPartnerDirections += '"Giro": "' + rsDet[j].Giro + '"';
                		businessPartnerDirections += "}";
                		
                		mDetailDirections.push(businessPartnerDirections);
            		}
            		
            		businessPartner += '"Directions": [' + mDetailDirections.join(",") + ']';
        		    businessPartner += "}";
        		    
            	}else{
            	    businessPartner += '"Directions": []';
        		    businessPartner += "}";
            	}
            	
            	mResult.push(JSON.parse(businessPartner));
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
	objResult = functions.CreateJSONMessage(-9703000, e.message +' - ' + businessPartner);
	
}finally{
    
    objResponse = functions.CreateResponse(objType, objResult, objCount);
	functions.DisplayJSON(objResponse, objType);
	
}