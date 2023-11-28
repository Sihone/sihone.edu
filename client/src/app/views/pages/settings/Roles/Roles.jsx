import {
  Box,
  Card,
  Divider,
  Grid,
  MenuItem,
  styled,
  TextField,
} from "@mui/material";
import { Breadcrumb, ConfirmationDialog } from "app/components";
import { H4 } from "app/components/Typography";
import { useEffect, useState } from "react";
import { useAuth, getSections } from "app/hooks/useAuth";
import useData from "app/hooks/useData";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {user} = useAuth();
  const {data, error, updateData, saveData, deleteData} = useData("roles", user.company_id);

  const sections = getSections(t);

  const StyledTextField = styled(TextField)(() => ({ margin: "8px" }));

  const handleSave = async () => {
    console.log("New role");
    setLoading(true);
    saveData({
      name,
      description,
      permissions: "[]"
    })
    .then(() => {
      enqueueSnackbar(t("main.success"), { variant: "success" });
      setLoading(false);
      setName("");
      setDescription("");
    })
    .catch((err) => {
      enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
      setLoading(false);
    });
  };

  const handleUpdate = async () => {
    console.log("Permissions update");
    setLoading(true);
    updateData({
      id: selectedRole.id,
      name: selectedRole.name,
      description: selectedRole.description,
      permissions: JSON.stringify(permissions)
    })
    .then(() => {
      enqueueSnackbar(t("main.success"), { variant: "success" });
      setLoading(false);
    })
    .catch((err) => {
      enqueueSnackbar(err.message || err.detail || err, { variant: "error" });
      setLoading(false);
    });
  };

  const handleRoleChange = (event) => {
    const role = data.find((item) => item.id == event.target.value);
    setSelectedRole(role);
    setPermissions(role ? JSON.parse(role.permissions) : []);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteData(selectedRole.id)
    .then((response) => {
      if (response.id) {
        setSelectedRole(null);
        setPermissions([]);
        enqueueSnackbar(t("main.success"), { variant: "success" });
      }
    })
    .finally(() => {
      setOpen(false);
      setLoading(false);
    });
  };


  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message || error.detail || error, { variant: "error" });
    }
  }, [error]);

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: t("settings.title") }, {name: t("settings.roles title")}]} />
      </div>

      <Card elevation={3}>
        <H4 p={2}>{t("settings.new role")}</H4>

        <Divider sx={{ mb: 1 }} />

        <Grid container spacing={3} alignItems="center" style={{padding: "16px 16px 0"}}>
          <Grid item md={2} sm={4} xs={12}>
            {t("settings.role name")}
          </Grid>

          <Grid item md={10} sm={8} xs={12}>
            <TextField
              size="small"
              name="name"
              variant="outlined"
              label={t("settings.role name")}
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ minWidth: 208 }}
            />
          </Grid>

          <Grid item md={2} sm={4} xs={12}>
            {t("settings.role description")}
          </Grid>

          <Grid item md={10} sm={8} xs={12}>
            <TextField
              size="small"
              name="description"
              variant="outlined"
              label={t("settings.role description")}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              sx={{ minWidth: 208 }}
            />
          </Grid>
        </Grid>

        <Box mt={3} style={{padding: "0 16px 16px", marginTop: "0"}}>
          <LoadingButton
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ mb: 2, mt: 3 }}
              disabled={!name}
              onClick={handleSave}
            >
              {t("main.submit")}
            </LoadingButton>
        </Box>
      </Card>

      <Card elevation={3} style={{marginTop: "36px"}}>
        <H4 p={2}>{t("settings.general permissions")}</H4>

        <Divider sx={{ mb: 1 }} />

        <Grid container spacing={3} alignItems="center" style={{padding: "0px 16px 0"}}>
          <Grid item md={2} sm={4} xs={12}>
            {t("settings.select role")}
          </Grid>

          <Grid item md={10} sm={8} xs={12}>
            {/* <Autocomplete
              disablePortal
              id="combo-box-demo"
              fullWidth
              options={data?.map((role) => {
                if (role.super == 1) return null;
                return {...role, label: role.name + " - " + role.description}
              })}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label={t("settings.select role")} />}
              onChange={(event, value) => handleRoleChange(value)}
              value={selectedRole}
              style={{marginTop: "16px"}}
            /> */}
            <StyledTextField
              select
              size="small"
              name="role"
              label={t("settings.select role")}
              variant="outlined"
              sx={{ minWidth: 208 }}
              value={selectedRole ? selectedRole.id : null}
              onChange={handleRoleChange}
            >
              <MenuItem value={null}>{t("settings.select role")}</MenuItem>
              {data?.map((item) => {
                if (item.super == 1) return null;
                return (
                  <MenuItem value={item.id} key={item.name}>
                    {item.name}{item.description ? " - " + item.description : ""}
                  </MenuItem>
                )
              })}
            </StyledTextField>
          </Grid>

          {
            selectedRole && (
              <>
                <Grid item md={2} sm={4} xs={12}>
                  {t("settings.select permissions")}
                </Grid>

                <Grid item md={10} sm={8} xs={12}>
                  {
                    Object.keys(sections).map((item) => (
                      <Box sx={{display: "flex", flexDirection: "row", gap: "16px"}}>
                        <input type="checkbox" checked={permissions.includes(sections[item].id)} onChange={(event) => {
                          if (event.target.checked) {
                            setPermissions([...permissions, sections[item].id]);
                          } else {
                            setPermissions(permissions.filter((permission) => permission !== sections[item].id));
                          }
                        }}
                        disabled={selectedRole.super == 1}
                        />
                        <p>{sections[item].label}</p>
                      </Box>
                    ))
                  }
                </Grid>
              </>
            )
          }
          
        </Grid>
        <Box mt={6} style={{padding: "0 16px 16px", marginTop: "0"}}>
          <LoadingButton
              color="error"
              loading={loading}
              variant="contained"
              sx={{ mb: 2, mt: 3 }}
              onClick={() => setOpen(true)}
              disabled={!selectedRole || selectedRole.super == 1}
              style={{marginRight: "16px"}}
          >
            {t("main.delete")}
          </LoadingButton>
          <LoadingButton
              color="primary"
              loading={loading}
              variant="contained"
              sx={{ mb: 2, mt: 3 }}
              onClick={handleUpdate}
              disabled={!selectedRole || selectedRole.super == 1}
          >
            {t("main.submit")}
          </LoadingButton>
        </Box>
      </Card>
      <ConfirmationDialog
        open={open}
        title={t("settings.role delete title")}
        text={t("settings.role delete text")}
        onConfirmDialogClose={() => setOpen(false)}
        onYesClick={handleDelete}
      />
    </Container>
  );
};

export default CustomerForm;
