$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objType;
var q;

function GetDataSales(codigo, database, addressType,address){
    try{
        var colWhr = "ShipToCode";
        if(addressType === 'B'){
            colWhr = "PayToCode";
        }
        
        var mQuery = 'SELECT TOP 1 T0."FolioPref" || \'-\' || LPAD(CAST(T0."FolioNum" AS NVARCHAR),7, \'0\') as "Codigo",  ' +
                     ' IFNULL(TO_VARCHAR(T0."DocDate", \'YYYYMMDD\'),\'\') as "Fecha", ' +
                     ' IFNULL(T0."DocTotal",0) as "Total"  ' +
                     ' FROM ' + database + '.OINV T0 where T0."CardCode" = \''+codigo+'\' ' +
                     '      AND T0."CANCELED" = \'N\' ' +
                     '      AND T0."' + colWhr + '" = \'' + address + '\' ' +
                     ' ORDER BY T0."DocDate" DESC ';
                     
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();             
        
        if (mRS.length > 0)
    	{
    	    return mRS[0];
    	}else{
    	    return undefined;
    	}
        
    }catch(e){
        return undefined;
    }
}

function ObtenerContactos(codigo, database){
    
    try {
        
        var mQuery = 'SELECT T0."CntctCode" AS "Codigo", ' +
                       ' 	T0."Name" AS "Nombre", ' +
                       ' 	IFNULL(T0."FirstName",\'\') AS "PrimerNombre", ' +
                       ' 	IFNULL(T0."MiddleName",\'\') AS "SegundoNombre", ' +
                       ' 	IFNULL(T0."LastName",\'\') AS "Apellidos", ' +
                       ' 	IFNULL(T0."Address",\'\') AS "Direccion", ' +
                       ' 	IFNULL(T0."E_MailL",\'\') AS "CorreoElectronico", ' +
                       ' 	IFNULL(T0."Tel1",\'\') AS "Telefono1", ' +
                       ' 	IFNULL(T0."Tel2",\'\') AS "Telefono2", ' +
                       ' 	IFNULL(T0."Cellolar",\'\') AS "TelefonoMovil", ' +
                       ' 	IFNULL(T0."Position",\'\') AS "Posicion", ' +
                       ' 	T0."CardCode" AS "SocioNegocio" ' +
                     '   FROM ' + database + '.OCPR T0 ' +
                     '   WHERE T0."Active" = \'Y\' AND T0."CardCode" = \'' +codigo+ '\';';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mBusinessPartnerContact = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    mBusinessPartnerContact = '{'; 
        		mBusinessPartnerContact += '"Codigo": "' + mRS[j].Codigo + '",';
        		mBusinessPartnerContact += '"Nombre": "' + functions.ReplaceInvalidChars(mRS[j].Nombre) + '",';
        		mBusinessPartnerContact += '"PrimerNombre": "' + mRS[j].PrimerNombre + '",';
        		mBusinessPartnerContact += '"SegundoNombre": "' + mRS[j].SegundoNombre + '",';
        		mBusinessPartnerContact += '"Apellidos": "' + mRS[j].Apellidos + '",';
        		mBusinessPartnerContact += '"Direccion": "' + mRS[j].Direccion + '",';
        		mBusinessPartnerContact += '"CorreoElectronico": "' + mRS[j].CorreoElectronico + '",';
        		mBusinessPartnerContact += '"Telefono1": "' + mRS[j].Telefono1 + '",';
        		mBusinessPartnerContact += '"Telefono2": "' + mRS[j].Telefono2 + '",';
        		mBusinessPartnerContact += '"TelefonoMovil": "' + mRS[j].TelefonoMovil + '",';
        		mBusinessPartnerContact += '"Posicion": "' + functions.ReplaceInvalidChars(mRS[j].Posicion) + '"';
        		mBusinessPartnerContact += "}";
        		
        		mLines.push(mBusinessPartnerContact);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

function ObtenerDirecciones(codigo, database){
    
    try {
        
        var mQuery = 'SELECT T0."Address" AS "Codigo", ' +
                    	'	IFNULL(T0."Country",\'\') AS "Pais", ' +
                    	'	IFNULL(T0."State",\'\') AS "Departamento", ' +
                    	'	IFNULL(T0."County",\'\') AS "Provincia", ' +
                    	'	IFNULL(T0."City",\'\') AS "Distrito", ' +
                    	'	IFNULL(T0."Street",\'\') AS "Calle", ' +
                    	'	IFNULL(T0."Block",\'\') AS "Referencia", ' +
                    	'	T0."AdresType" AS "Tipo", ' +
                    	'	IFNULL(T0."U_MSSM_LAT",\'\') AS "Latitud", ' +
                    	'	IFNULL(T0."U_MSSM_LON",\'\') AS "Longitud", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVLU" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVLU" AS CHAR(1)) END,\'N\') AS "VisitaLunes", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVMA" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVMA" AS CHAR(1)) END,\'N\') AS "VisitaMartes", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVMI" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVMI" AS CHAR(1)) END,\'N\') AS "VisitaMiercoles", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVJU" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVJU" AS CHAR(1)) END,\'N\') AS "VisitaJueves", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVVI" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVVI" AS CHAR(1)) END,\'N\') AS "VisitaViernes", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVSA" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVSA" AS CHAR(1)) END,\'N\') AS "VisitaSabado", ' +
                    	'	IFNULL(CASE CAST(T0."U_MSS_DVDO" AS CHAR(1))  ' +
                    	            ' WHEN \'1\' THEN \'Y\' ' + 
                    	            ' WHEN \'0\' THEN \'N\' ' + 
                    	            ' ELSE CAST(T0."U_MSS_DVDO" AS CHAR(1)) END,\'N\') AS "VisitaDomingo", ' +
                    	'	IFNULL(T0."U_MSS_FREC",\'\') AS "Frecuencia", ' +
                    	'	IFNULL(T0."U_MSS_RUTA",\'\') AS "Ruta", ' +
                    	'	IFNULL(T0."U_MSS_ZONA",\'\') AS "Zona", ' +
                    	'	IFNULL(T0."U_MSS_CANA",\'\') AS "Canal", ' +
                    	'	IFNULL(T0."U_MSS_GIRO",\'\') AS "Giro", ' +
                    	'	IFNULL(TO_VARCHAR(T0."U_MSSM_FIV",\'YYYYMMDD\'),\'\') AS "InicioVisitas", ' +
                    	'	IFNULL(T1."SlpName", \'\') AS "Vendedor" ' +
                    '	FROM ' + database + '.CRD1 T0 LEFT JOIN ' + database + '.OSLP T1 ' +
                    '       ON T0."U_MSS_COVE" = T1."SlpCode" ' +
                   ' WHERE T0."CardCode" = \'' +codigo+ '\';';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(mQuery);
    	mConn.close();
    	
    	var j;
    	var mBusinessPartnerDirection = '';
    	var mLines = [];
	    
	    if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    var lastSales = GetDataSales(codigo, database, mRS[j].Tipo, mRS[j].Codigo);
    		    mBusinessPartnerDirection = '{'; 
        		mBusinessPartnerDirection += '"Codigo": "' + mRS[j].Codigo + '",';
        		mBusinessPartnerDirection += '"Pais": "' + mRS[j].Pais + '",';
        		mBusinessPartnerDirection += '"Departamento": "' + mRS[j].Departamento + '",';
        		mBusinessPartnerDirection += '"Provincia": "' + mRS[j].Provincia + '",';
        		mBusinessPartnerDirection += '"Distrito": "' + mRS[j].Distrito + '",';
        		mBusinessPartnerDirection += '"Calle": "' + functions.ReplaceInvalidChars(mRS[j].Calle) + '",';
        		mBusinessPartnerDirection += '"Referencia": "' + functions.ReplaceInvalidChars(mRS[j].Referencia) + '",';
        		mBusinessPartnerDirection += '"Tipo": "' + mRS[j].Tipo + '",';
        		mBusinessPartnerDirection += '"Latitud": "' + mRS[j].Latitud + '",';
        		mBusinessPartnerDirection += '"Longitud": "' + mRS[j].Longitud + '",';
        		mBusinessPartnerDirection += '"VisitaLunes": "' + mRS[j].VisitaLunes + '",';
        		mBusinessPartnerDirection += '"VisitaMartes": "' + mRS[j].VisitaMartes + '",';
        		mBusinessPartnerDirection += '"VisitaMiercoles": "' + mRS[j].VisitaMiercoles + '",';
        		mBusinessPartnerDirection += '"VisitaJueves": "' + mRS[j].VisitaJueves + '",';
        		mBusinessPartnerDirection += '"VisitaViernes": "' + mRS[j].VisitaViernes + '",';
        		mBusinessPartnerDirection += '"VisitaSabado": "' + mRS[j].VisitaSabado + '",';
        		mBusinessPartnerDirection += '"VisitaDomingo": "' + mRS[j].VisitaDomingo + '",';
        		mBusinessPartnerDirection += '"Frecuencia": "' + mRS[j].Frecuencia + '",';
        		mBusinessPartnerDirection += '"Ruta": "' + mRS[j].Ruta + '",';
        		mBusinessPartnerDirection += '"Zona": "' + mRS[j].Zona + '",';
        		mBusinessPartnerDirection += '"Canal": "' + mRS[j].Canal + '",';
        		mBusinessPartnerDirection += '"Giro": "' + mRS[j].Giro + '",';
        		mBusinessPartnerDirection += '"InicioVisitas": "' + mRS[j].InicioVisitas + '",';
        		mBusinessPartnerDirection += '"Vendedor": "' + mRS[j].Vendedor + '",';
        		if(lastSales !== undefined){
        		    mBusinessPartnerDirection += '"CodigoUltimaCompra": "'+lastSales.Codigo+'",';    
        		    mBusinessPartnerDirection += '"FechaUltimaCompra": "'+lastSales.Fecha+'",';    
        		    mBusinessPartnerDirection += '"MontoUltimaCompra": "'+lastSales.Total+'"';    
        		}else{
        		    mBusinessPartnerDirection += '"CodigoUltimaCompra": "",';    
        		    mBusinessPartnerDirection += '"FechaUltimaCompra": "",';    
        		    mBusinessPartnerDirection += '"MontoUltimaCompra": ""'; 
        		}
        		mBusinessPartnerDirection += "}";
        		
        		mLines.push(mBusinessPartnerDirection);
    		}
    	}else{
    	    return '';
    	}
    	
    	return mLines.join(",");
        
    }catch(e){
       return ''; 
    }
}

function ObtenerEmpleados(supervisor, database){
    var emp = [];
    try{
        q = 'SELECT T0."SlpCode" FROM '+database+'.OSLP T0  '  +
                    ' where T0."U_MSS_SUPE" = (SELECT DISTINCT "Code" ' + 
                    ' FROM '+database+'."@MSS_SUPE" where "U_MSS_EVEN" = ' + supervisor + ')';
        
        var mConn = $.hdb.getConnection();
    	var mRS = mConn.executeQuery(q);
    	mConn.close();
    	emp.push(supervisor);
    	
    	var j;
        
        if (mRS.length > 0)
    	{
    	   for(j = 0; j < mRS.length ; j++)
    		{
    		    emp.push(mRS[j].SlpCode);
    		}
    		
    	}
    	
    	return emp.join(",");
    	
    }catch(e){
        q = e.message;
        return undefined;
    }
}

var mBusinessPartner = '';
var query = '';

try{
 
    var empId = $.request.parameters.get('empId');
    var cove = $.request.parameters.get('cove');
    
    if (empId !== undefined && cove !== undefined)
	{ 
	    var dbname = functions.GetDataBase(empId);
	    var emps = ObtenerEmpleados(cove, dbname);
	    
	    if(emps !== undefined){
            query = 'SELECT T0."CardCode" AS "Codigo",  ' +
                            '	T0."CardType" AS "TipoSocio", ' +
                            '	T0."U_MSSL_BTP" AS "TipoPersona", ' +
                            '	T0."U_MSSL_BTD" AS "TipoDocumento", ' +
                            '	T0."LicTradNum" AS "NumeroDocumento", ' +
                            '	T0."CardName" AS "NombreRazonSocial", ' +
                            '	IFNULL(T0."CardFName",\'\') AS "NombreComercial", ' +
                            '	IFNULL(T0."U_MSSL_BAP",\'\') AS "ApellidoPaterno", ' +
                            '	IFNULL(T0."U_MSSL_BAM",\'\') AS "ApellidoMaterno", ' +
                            '	IFNULL(T0."U_MSSL_BN1",\'\') AS "PrimerNombre", ' +
                            '	IFNULL(T0."U_MSSL_BN2",\'\') AS "SegundoNombre", ' +
                            '	IFNULL(T0."Phone1",\'\') AS "Telefono1", ' +
                            '	IFNULL(T0."Phone2",\'\') AS "Telefono2", ' +
                            '	IFNULL(T0."Cellular",\'\') AS "TelefonoMovil", ' +
                            '	IFNULL(T0."E_Mail",\'\') AS "CorreoElectronico", ' +
                            '	T0."GroupCode" AS "GrupoSocio", ' +
                            '	T0."ListNum" AS "ListaPrecio", ' +
                            '	T0."GroupNum" AS "CondicionPago", ' +
                            '	IFNULL(T0."Indicator",\'\') AS "Indicador", ' +
                            '	-1 AS "Zona", ' +
                            '	IFNULL(T0."U_MSSM_CRM",\'N\') AS "CreadMovil", ' +
                            '	IFNULL(T0."U_MSSM_CLM",\'\') AS "ClaveMovil", ' +
                            '	IFNULL(T0."BillToDef",\'\') AS "DireccionFiscal", ' +
                            '	IFNULL(T0."U_MSSM_TRM",\'01\') AS "TransaccionMovil", ' +
                            '	\'Y\' AS "ValidoenPedido", ' +
                            '	IFNULL(T1."Address",\'\') AS "DireccionFiscalCodigo", ' +
                            '	IFNULL(T0."ProjectCod",\'\') AS "Proyecto", ' +
                            '	IFNULL(T0."U_MSSM_TRE",\'01\') AS "TipoRegistro", ' +
                            '	IFNULL(T0."U_MSSM_POA",\'N\') AS "PoseeActivos", ' +
                            '	IFNULL(T0."CntctPrsn",\'\') AS "PersonaContacto", ' +
                            '	IFNULL(T0."Balance",0) AS "SaldoCuenta", ' +
                             '	IFNULL(T0."U_MSS_DSC",0) AS "Descuento" ' +
                         '   FROM ' + dbname + '.OCRD T0 ' +
                         '   JOIN ' + dbname + '.CRD1 T1 ON T1."Address" = T0."BillToDef" ' +
                         ' AND T1."CardCode" = T0."CardCode"  AND T1."AdresType" = \'B\' '+
                         '   WHERE T0."CardType" <> \'S\' ' + 
                         '   AND  (SELECT IFNULL(COUNT("U_MSS_COVE"),0) FROM ' + dbname + '.CRD1 WHERE ' +
                     ' "CardCode" = T0."CardCode" AND "AdresType" = \'B\' AND "U_MSS_COVE" IN  ( '+emps+' ) ) > 0 ' + 
                     //'   AND T0."validFor" = \'Y\' '+
                     '   AND T0."frozenFor" = \'N\'';
    	        
        	var conn = $.hdb.getConnection();
        	var rs = conn.executeQuery(query);
        	conn.close();
    	    
    	    if (rs.length > 0)
        	{
        	    
        		var mResult = [];
        		var i;
        		
        		for(i = 0; i < rs.length ; i++)
        		{
        		    var dataSales; // = GetDataSales(rs[i].Codigo, dbname);
        		    
        			mBusinessPartner = '{';   
        			mBusinessPartner += '"Codigo": "'+rs[i].Codigo+'",';
            		mBusinessPartner += '"TipoSocio": "'+rs[i].TipoSocio+'",';
            		mBusinessPartner += '"TipoPersona": "'+rs[i].TipoPersona+'",';
            		mBusinessPartner += '"TipoDocumento": "'+rs[i].TipoDocumento+'",';
            		mBusinessPartner += '"NumeroDocumento": "'+rs[i].NumeroDocumento+'",';
            		mBusinessPartner += '"NombreRazonSocial": "'+functions.ReplaceInvalidChars(rs[i].NombreRazonSocial)+'",';
            		mBusinessPartner += '"NombreComercial": "'+rs[i].NombreComercial+'",';
            		mBusinessPartner += '"ApellidoPaterno": "'+rs[i].ApellidoPaterno+'",';
            		mBusinessPartner += '"ApellidoMaterno": "'+rs[i].ApellidoMaterno+'",';
            		mBusinessPartner += '"PrimerNombre": "'+rs[i].PrimerNombre+'",';
            		mBusinessPartner += '"SegundoNombre": "'+rs[i].SegundoNombre+'",';
            		mBusinessPartner += '"Telefono1": "'+rs[i].Telefono1+'",';
            		mBusinessPartner += '"Telefono2": "'+rs[i].Telefono2+'",';
            		mBusinessPartner += '"TelefonoMovil": "'+rs[i].TelefonoMovil+'",';
            		mBusinessPartner += '"CorreoElectronico": "'+rs[i].CorreoElectronico+'",';
            		mBusinessPartner += '"GrupoSocio": '+rs[i].GrupoSocio+',';
            		mBusinessPartner += '"ListaPrecio": '+rs[i].ListaPrecio+',';
            		mBusinessPartner += '"CondicionPago": '+rs[i].CondicionPago+',';
            		mBusinessPartner += '"Indicador": "'+rs[i].Indicador+'",';
            		mBusinessPartner += '"Zona": "'+rs[i].Zona+'",';
            		mBusinessPartner += '"CreadMovil": "'+rs[i].CreadMovil+'",';
            		mBusinessPartner += '"ClaveMovil": "'+rs[i].ClaveMovil+'",';
            		mBusinessPartner += '"TransaccionMovil": "'+rs[i].TransaccionMovil+'",';
            		mBusinessPartner += '"ValidoenPedido": "'+rs[i].ValidoenPedido+'",';
            		mBusinessPartner += '"DireccionFiscalCodigo": "'+rs[i].DireccionFiscalCodigo+'",';
            		mBusinessPartner += '"PoseeActivos": "'+rs[i].PoseeActivos+'",';
            		mBusinessPartner += '"Proyecto": "'+rs[i].Proyecto+'",';
            		mBusinessPartner += '"TipoRegistro": "'+rs[i].TipoRegistro+'",';
            		mBusinessPartner += '"SaldoCuenta": '+rs[i].SaldoCuenta+',';
                        mBusinessPartner += '"Descuento": '+rs[i].Descuento+',';
            		mBusinessPartner += '"PersonaContacto": "'+rs[i].PersonaContacto+'",';
            		if(dataSales !== undefined){
        		        mBusinessPartner += '"CodigoUltimaCompra": "'+dataSales.Codigo+'",';    
            		    mBusinessPartner += '"FechaUltimaCompra": "'+dataSales.Fecha+'",';    
            		    mBusinessPartner += '"MontoUltimaCompra": "'+dataSales.Total+'",';    
            		}else{
            		    mBusinessPartner += '"CodigoUltimaCompra": "",';    
            		    mBusinessPartner += '"FechaUltimaCompra": "",';    
            		    mBusinessPartner += '"MontoUltimaCompra": "",'; 
            		}
            		mBusinessPartner += '"Contactos": [' + ObtenerContactos(rs[i].Codigo, dbname) + '],';
            		mBusinessPartner += '"Direcciones": [' + ObtenerDirecciones(rs[i].Codigo, dbname) + ']';
            		mBusinessPartner += "}";
            		
            		mResult.push(JSON.parse(mBusinessPartner));
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
    	    objResult = functions.CreateJSONMessage(-99, "El usuario supervisor no tiene empleados asignados. U("+q+")");
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
	objResponse = functions.CreateJSONMessage(-9703000, e.message + " - " + mBusinessPartner);
	objResponse = functions.CreateResponse(objType, objResponse, 0);
	functions.DisplayJSON(objResponse,objType);
}