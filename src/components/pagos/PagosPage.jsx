import { useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material'

import CreditCardIcon from '@mui/icons-material/CreditCard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'

import { QRCodeCanvas } from 'qrcode.react'

import { useAuth } from '../usuarios/AuthContext'
import { registrarPago } from './pagosService'

import * as styles from './PagosPage.styles'

export default function PagosPage() {
  const { firebaseUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagoGenerado, setPagoGenerado] = useState(null)
  const [qrAbierto, setQrAbierto] = useState(false)

  const realizarPago = async (tipoPago) => {
    if (!firebaseUser?.uid) {
      setError('Debes iniciar sesión para realizar el pago.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const monto =
        tipoPago === 'suscripcion'
          ? 100
          : 5

      const resultado = await registrarPago({
        usuarioId: firebaseUser.uid,
        correo: firebaseUser.email,
        tipoPago,
        monto,
      })

      setPagoGenerado(resultado)
      setQrAbierto(true)
    } catch (err) {
      console.error('Error registrando pago:', err)

      setError(
        'No fue posible registrar el pago. Intenta nuevamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={styles.page}>

      <Box sx={styles.header}>
        <Typography variant="h4" sx={styles.title}>
          Mis pagos
        </Typography>

        <Typography sx={styles.subtitle}>
          Selecciona la forma en la que deseas viajar.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ marginBottom: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box sx={styles.cardsContainer}>

        {/* SUSCRIPCIÓN */}

        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>

            <Box sx={styles.iconContainer}>
              <CalendarMonthIcon sx={styles.icon} />
            </Box>

            <Typography
              variant="h5"
              sx={styles.cardTitle}
            >
              Suscripción mensual
            </Typography>

            <Chip
              label="Plan mensual"
              color="primary"
              size="small"
              sx={styles.chip}
            />

            <Typography sx={styles.description}>
              Viaja durante todo el mes utilizando
              tu suscripción.
            </Typography>

            <Divider sx={styles.divider} />

            <Typography sx={styles.price}>
              Q100.00
            </Typography>

            <Typography sx={styles.priceDescription}>
              por mes
            </Typography>

            <Button
              variant="contained"
              startIcon={
                loading
                  ? <CircularProgress size={18} color="inherit" />
                  : <CreditCardIcon />
              }
              fullWidth
              disabled={loading}
              sx={styles.primaryButton}
              onClick={() => realizarPago('suscripcion')}
            >
              Comprar suscripción
            </Button>

          </CardContent>
        </Card>


        {/* PAGO POR VIAJE */}

        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>

            <Box sx={styles.iconContainer}>
              <DirectionsBusIcon sx={styles.icon} />
            </Box>

            <Typography
              variant="h5"
              sx={styles.cardTitle}
            >
              Pago por viaje
            </Typography>

            <Chip
              label="Pago individual"
              color="success"
              size="small"
              sx={styles.chip}
            />

            <Typography sx={styles.description}>
              Paga únicamente el viaje que deseas
              realizar.
            </Typography>

            <Divider sx={styles.divider} />

            <Typography sx={styles.price}>
              Q5.00
            </Typography>

            <Typography sx={styles.priceDescription}>
              por viaje
            </Typography>

            <Button
              variant="contained"
              startIcon={
                loading
                  ? <CircularProgress size={18} color="inherit" />
                  : <CreditCardIcon />
              }
              fullWidth
              disabled={loading}
              sx={styles.primaryButton}
              onClick={() => realizarPago('viaje')}
            >
              Pagar viaje
            </Button>

          </CardContent>
        </Card>

      </Box>


      {/* QR GENERADO */}

      <Dialog
        open={qrAbierto}
        onClose={() => setQrAbierto(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <QrCode2RoundedIcon
            sx={{
              verticalAlign: 'middle',
              marginRight: 1,
            }}
          />

          QR de acceso
        </DialogTitle>

        <DialogContent>

          {pagoGenerado && (
            <Box
              sx={{
                textAlign: 'center',
                padding: 2,
              }}
            >
              <Alert
                severity="success"
                sx={{ marginBottom: 3 }}
              >
                Pago registrado correctamente
              </Alert>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 3,
                }}
              >
                <QRCodeCanvas
                  value={pagoGenerado.qrToken}
                  size={220}
                  level="H"
                />
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                {pagoGenerado.tipoPago === 'suscripcion'
                  ? 'Suscripción mensual'
                  : 'Pago por viaje'}
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  marginTop: 1,
                }}
              >
                Monto: Q
                {pagoGenerado.monto.toFixed(2)}
              </Typography>

              <Typography
                sx={{
                  marginTop: 2,
                  fontSize: '14px',
                  color: 'text.secondary',
                }}
              >
                Presenta este código QR al piloto
                para validar tu viaje.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 3,
                  textTransform: 'none',
                }}
                onClick={() => setQrAbierto(false)}
              >
                Cerrar
              </Button>
            </Box>
          )}

        </DialogContent>
      </Dialog>

    </Box>
  )
}